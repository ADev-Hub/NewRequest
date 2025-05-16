import * as React from "react";
import { useState, useEffect } from "react";
import { Web } from "sp-pnp-js";
import * as util from '../../../../Util';
import { LogLevel } from '@pnp/logging';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
const ExecDeliveryReq = (props: any) => {
  const web = new Web(props?.webPartProps?.siteUrl);

  const { values } = props;
  const [reportFrquencies, setReportFrquencies] = useState<JSX.Element[]>([]);
  const [reportLayouts, setReportLayouts] = useState<JSX.Element[]>([]);
  const [outPutFormats, setOutPutFormats] = useState([
    { text: "Qlik", checked: false },
    { text: "PDF", checked: false },
    { text: "PowerPoint", checked: false },
    { text: "Excel", checked: false },
    { text: "Word", checked: false },
    { text: "CSV", checked: false },
    { text: "Other", checked: false },
  ]);
  const [weekDays, setWeekDays] = useState([
    { text: "Monday", checked: false },
    { text: "Tuesday", checked: false },
    { text: "Wednesday", checked: false },
    { text: "Thursday", checked: false },
    { text: "Friday", checked: false },
  ]);

  useEffect(() => {

    getReportFrequency();
    getReportLayout();
  }, []);

  useEffect(() => {
    const { values } = props;
    if (values.formMode === "view") {
      const dvPrevComments = document.getElementById("dvPrevComments");
      if (dvPrevComments) {
        dvPrevComments.innerHTML = values.prevComment;
      }
    }
    if (props.currentStep === 3 || values.formMode === "view") {
      const selectedWeeks = values.selectedWeekRecurrences.split(",");
      if (selectedWeeks.length > 0) {
        setWeekDays((prevDays) =>
          prevDays.map((day) => ({
            ...day,
            checked: selectedWeeks.includes(day.text),
          }))
        );
      }
    }
  }, [props.currentStep, props.values.formMode, props.values.selectedWeekRecurrences]);

  useEffect(() => {
    const { values } = props;
    if (values.formMode === "view") {
      const dvPrevComments = document.getElementById("dvPrevComments");
      if (dvPrevComments) {
        dvPrevComments.innerHTML = values.prevComment;
      }
    }
  });

  const onToggleFileType = (index: number) => {
    const newFormats = [...outPutFormats];
    if (values.outPutFormat !== undefined && values.outPutFormat !== "") {
      newFormats.forEach((item) => {
        item.checked = values.outPutFormat.includes(item.text);
      });
    }

    newFormats[index].checked = !newFormats[index].checked;
    setOutPutFormats(newFormats);
    const checkedInfo = newFormats.filter((x) => x.checked);
    const checkedFormats = checkedInfo.map((x) => x.text);
    props.setFieldValues("outPutFormat", checkedFormats.join(","));
  };

  const onToggle = (index: number) => {
    const newDays = [...weekDays];
    newDays[index].checked = !newDays[index].checked;
    setWeekDays(newDays);
    const checkedInfo = newDays.filter((x) => x.checked);
    const checkedDays = checkedInfo.map((x) => x.text);
    props.setFieldValues("selectedWeekRecurrences", checkedDays.join(","));
  };

  const getReportFrequency = async () => {
    try {
      const items = await web.lists
        .getByTitle("Report Frequency")
        .items
        .filter("IsActive eq 'Yes'")
        .select("Id", "Title")
        .orderBy("Title", true)
        .top(1000)
        .get();

      setReportFrquencies(
        items.map((reportFrquency: any) => (
          <option key={reportFrquency.Id} value={reportFrquency.Id}>
            {reportFrquency.Title}
          </option>
        ))
      );
    } catch (err: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getReportFrequency", err.status || "Error", LogLevel.Error, err.message);
      console.log(err);
    }
  };

  const getReportLayout = async () => {
    try {
      const items = await web.lists
        .getByTitle("Report Layout")
        .items
        .filter("IsActive eq 'Yes'")
        .select("Id", "Title")
        .orderBy("Title", true)
        .top(1000)
        .get();

      setReportLayouts(
        items.map((reportLayout: any) => (
          <option key={reportLayout.Id} value={reportLayout.Id}>
            {reportLayout.Title}
          </option>
        ))
      );
    } catch (err: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getReportLayout", err.status || "Error", LogLevel.Error, err.message);
      console.log(err);
    }
  };

  const _onPplPickerChange = (stateName: string, items: any[]) => {
    props.setFieldValues(stateName, items);
  };

  const _onPplPickerChange1 = (stateName: string, items: any[]) => {
    let selectedUsers;
    if (items.length === 1) {
      selectedUsers = [
        {
          id: items[0].id,
          email: items[0].email || items[0].secondaryText,
        },
      ];
    } else {
      selectedUsers = items.map((item) => ({
        id: item.id,
        email: item.email || item.secondaryText,
      }));
    }
    props.setFieldValues(stateName, selectedUsers);
  };
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "monthlyDayRecur" || name === "monthlyMonthRecur" || name === "monthOccurence") {
      if (value.length > 2 || parseInt(value) > 99) {
        return;
      }
    }
    if (name == "reportFrqncy") {
      let copyvalue = parseInt(value)
      props.setFieldValues(name, copyvalue);
    } else {
      props.setFieldValues(name, value);
    }
    if (name === 'delOptionOthr' && value.length > 255) {
      alert("Maximum 255 characters allowed!");
    }
  };

  if (props.currentStep === 1 || values.formMode === "view") {
    return (
      <div className="clearFields mainDiv">
        <details className="SidebarAccordion" open>
          <summary className="check-list-header">Schedule and Delivery Requirements</summary>
          <div className="expand-AccordionContent clearfix">
            <div>

              <div className="clearFields mb-2">
                <label className="form-label w-100">Output <span className="ReqField">*</span></label>
                {outPutFormats.map((item, i) => (
                  <span className="form-check form-check-inline" key={i}>
                    <input
                      type="checkbox" className="form-check-input"
                      onChange={() => onToggleFileType(i)}
                      checked={values?.outPutFormat?.includes(item.text)}
                    />
                    <span className="right">{item.text}</span>
                  </span>
                ))}
                {values.buttonClick === 1 && values.outPutFormat.length === 0 && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>

              {values.outPutFormat.includes("Other") &&
                <div className="mb-2">
                  <label className="form-label w-100">Output Option Other
                    <span className="ReqField">*</span>
                  </label>
                  <div className="inputDiv">
                    <input
                      type="textbox"
                      className="form-control"
                      value={values.delOptionOthr}
                      onChange={handleInputChange}
                      name="delOptionOthr"
                      maxLength={255}
                    />
                    {values.buttonClick === 1 && values.delOptionOthr.length === 0 && values.outPutFormat.includes("Other") && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                </div>
              }
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label w-100">Report Frequency</label>
                  <div className="inputDiv">
                    <select
                      name="reportFrqncy"
                      value={values.reportFrqncy}
                      className="form-control"
                      onChange={handleInputChange}
                    >
                      {reportFrquencies}
                    </select>
                  </div>
                </div>
                {values.reportFrqncy === 1 &&
                  <div className="col-md-6">
                    <label className="form-label w-100">
                      Report Distribution List
                      <span className="ReqField">*</span>
                    </label>

                    <div className="inputDiv">
                      <PeoplePicker
                        context={props.webPartProps.context}
                        titleText=""
                        personSelectionLimit={5}
                        groupName={""}
                        required={false}
                        ensureUser={true}
                        defaultSelectedUsers={values.busRec?.map((user: any) => user.secondaryText !== undefined ? user.secondaryText : user?.EMail)}
                        onChange={(items: any) => _onPplPickerChange("busRec", items)}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000}
                        disabled={values.formMode === "view"}
                      />
                    </div>

                    {values.buttonClick === 1 && values.reportFrqncy === 1 && values?.busRec?.length === 0 && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                }</div>
              {values.reportFrqncy === 1 &&
                <div className="mb-2">
                  <label className="form-label w-100">
                    Automated Scheduled Recurrence
                    <span className="ReqField">*</span>
                  </label>
                  <div className="">

                    <span className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="autoSchRec"
                        value="Daily"
                        checked={values.autoSchRec === "Daily"}
                        onChange={handleInputChange}
                      />
                      <span>Daily</span>
                    </span>
                    <span className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="autoSchRec"
                        value="Weekly"
                        checked={values.autoSchRec === "Weekly"}
                        onChange={handleInputChange}
                      />
                      <span>Weekly</span>
                    </span>
                    <span className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="autoSchRec"
                        value="Monthly"
                        checked={values.autoSchRec === "Monthly"}
                        onChange={handleInputChange}
                      />
                      <span>Monthly</span>
                    </span>

                  </div>
                  {values.buttonClick === 1 && values.reportFrqncy === 1 && values.autoSchRec.length === 0 && (
                    <div className="errorMessage clearFields">Field is required</div>
                  )}
                </div>}
              {values.reportFrqncy === 1 && values.autoSchRec === "Daily" &&
                <div className="row mb-2">
                  <div className="col-md-4">
                    <span className="form-check form-check-inline">
                      <input
                        type="radio" className="form-check-input"
                        name="recurrenceDaily"
                        value="everyDay"
                        checked={values.recurrenceDaily === "everyDay"}
                        onChange={handleInputChange}
                      /><span> Every</span></span>
                    <span className="form-check form-check-inline">
                      <input
                        type="number"
                        className="width65"
                        value={values.dailyEveryDayRecur}
                        name="dailyEveryDayRecur"
                        onChange={handleInputChange}
                      />&nbsp; Day
                    </span>
                  </div>
                  <div className="col-md-4">
                    <span className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="recurrenceDaily"
                        value="everyWeekDay"
                        checked={values.recurrenceDaily === "everyWeekDay"}
                        onChange={handleInputChange}
                      /><span>&nbsp; Every weekday</span>
                    </span>
                  </div>
                  {values.buttonClick === 1 && values.reportFrqncy === 1 && values.autoSchRec === "Daily" &&
                    (values.recurrenceDaily.length === 0 ||
                      (values.recurrenceDaily === "everyDay" && values.dailyEveryDayRecur.length === 0)) && (
                      <div className="errorMessage paddingLeft15 clearFields">Field is required</div>
                    )}
                </div>
              }
              {values.reportFrqncy === 1 && values.autoSchRec === "Weekly" &&
                <div className="mb-2">
                  <div className="paddngbtm6">
                    Recur every&nbsp;
                    <input
                      type="number"
                      className="fields width20"
                      value={values.weekRecurrence}
                      onChange={handleInputChange}
                      name="weekRecurrence"
                    />
                    &nbsp;week(s) on:
                  </div>
                  <div className="clearFields">
                    {weekDays.map((item, i) => (
                      <div className="form-check form-check-inline" key={i}>
                        <input className="form-check-input"
                          type="checkbox"
                          onChange={() => onToggle(i)}
                          checked={values.selectedWeekRecurrences.includes(item.text)}
                        />
                        <span className="right">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  {values.buttonClick === 1 && values.reportFrqncy === 1 && values.autoSchRec === "Weekly" &&
                    (values.weekRecurrence.length === 0 || values.selectedWeekRecurrences.length === 0) && (
                      <div className="errorMessage clearFields">Field is required</div>
                    )}
                </div>
              }
              {values.reportFrqncy === 1 && values.autoSchRec === "Monthly" &&
                <div>
                  <div className="paddngbtm6 mb-2">
                    <span className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="recurrenceMonthly"
                        value="everyDay"
                        checked={values.recurrenceMonthly === "everyDay"}
                        onChange={handleInputChange}
                      /><span>&nbsp; Day</span></span>
                    <span className="">
                      <input
                        type="number"
                        className="width15 fields inputcontrolstyle"
                        name="monthlyDayRecur"
                        value={values.monthlyDayRecur}
                        onChange={handleInputChange}
                        maxLength={2}
                        min={1}
                        max={99}
                      /><span>&nbsp; of every{" "}</span>

                    </span>
                    <span className="">
                      <input
                        type="number"
                        className="width15 fields inputcontrolstyle"
                        name="monthlyMonthRecur"
                        value={values.monthlyMonthRecur}
                        onChange={handleInputChange}
                        maxLength={2}
                        min={1}
                        max={99}
                      />
                      &nbsp;month(s)
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="recurrenceMonthly"
                        value="selectedDay"
                        checked={values.recurrenceMonthly === "selectedDay"}
                        onChange={handleInputChange}
                      /><span>The</span></span>
                    <span>
                      <select
                        name="monthlySelectedDay1"
                        onChange={handleInputChange}
                        value={values.monthlySelectedDay1}
                        className="fields width15 marginRight"
                      >
                        <option value=""> Select</option>
                        <option value="First">First </option>
                        <option value="Second">Second</option>
                        <option value="Third">Third</option>
                        <option value="Fourth">Fourth</option>
                        <option value="Last">Last</option>
                      </select>
                      &nbsp;
                      <select
                        name="monthlySelectedDay2"
                        value={values.monthlySelectedDay2}
                        onChange={handleInputChange}
                        className="fields width15 marginRight"
                      >
                        <option value=""> Select</option>
                        <option value="weekday">weekday</option>
                        <option value="weekend day">weekend day</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                      &nbsp; of every{" "}
                      <input
                        type="number"
                        className="width15 fields inputcontrolstyle"
                        value={values.monthOccurence}
                        onChange={handleInputChange}
                        name="monthOccurence"
                        maxLength={2}
                        min={1}
                        max={99}
                      />
                      &nbsp;month(s)
                    </span>
                  </div>
                  {values.buttonClick === 1 && values.reportFrqncy === 1 && values.autoSchRec === "Monthly" &&
                    (values.recurrenceMonthly.length === 0 ||
                      (values.recurrenceMonthly === "everyDay" &&
                        (values.monthlyDayRecur.length === 0 || values.monthlyMonthRecur.length === 0)) ||
                      (values.recurrenceMonthly === "selectedDay" &&
                        (values.monthlySelectedDay1.length === 0 || values.monthlySelectedDay2.length === 0 || values.monthOccurence.length === 0))) && (
                      <div className="errorMessage">Field is required</div>
                    )}
                </div>
              }


            </div>

            {values.formMode === "view" &&
              <div>
                <label className="form-label w-100">Previous Comments</label>
                <div className="commentSection">
                  <div className="viewMode" dangerouslySetInnerHTML={{ __html: values?.prevComment }}></div>
                </div>
              </div>
            }
          </div>
          {values.formMode === "edit" &&
            <details className="SidebarAccordion" open>
              <summary className="check-list-header">Informatics Only</summary>
              <div className="expand-AccordionContent clearfix">
                <label className="form-label w-100">Level of complexity</label>
                <div className="inputDiv mb-2">
                  <select
                    name="LevelOfComplexity"
                    className="form-control"
                    value={values.LevelOfComplexity}
                    onChange={handleInputChange}
                  >
                    {values.LevelOfComplexityChoices && values.LevelOfComplexityChoices.length === 0 ? (
                      <option value={0}>Select</option>
                    ) : (
                      values.LevelOfComplexityChoices.map((choice: any, index: any) => (
                        <option key={index} value={index}>
                          {choice}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label w-100">Confidence Level</label>
                  <div className="inputDiv">
                    <select
                      name="ConfidenceLevel"
                      className="form-control"
                      value={values.ConfidenceLevel}
                      onChange={handleInputChange}
                    >
                      {values.ConfidenceLevelChoices && values.ConfidenceLevelChoices.length === 0 ? (
                        <option value={0}>Select</option>
                      ) : (
                        values.ConfidenceLevelChoices.map((choice: any, index: any) => (
                          <option key={index} value={index}>
                            {choice}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label w-100">Working Month</label>
                  <select
                    name="WorkingMonth"
                    className="form-control"
                    value={values.WorkingMonth}
                    onChange={handleInputChange}
                  >
                    {values.YearMonthChoices && values.YearMonthChoices.length === 0 ? (
                      <option value={0}>Select</option>
                    ) : (
                      values.YearMonthChoices.map((choice: any, index: any) => (
                        <option key={index} value={choice}>
                          {choice}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </details>
          }
        </details></div>
    );
  }

  return null;
};

export default ExecDeliveryReq;
