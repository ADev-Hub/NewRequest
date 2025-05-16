import * as React from "react";
import { IRequestFormProps } from "../IRequestFormProps";
import { DatePicker } from "office-ui-fabric-react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as util from '../../../../Util';
import { LogLevel } from '@pnp/logging';
import { CustomToolTip } from "../../../../GlobalComponent/customToolTip";
import { Web } from "sp-pnp-js";
const InformationStep = (props: any) => {
  const web = new Web(props?.webPartProps?.siteUrl);
  const [departments, setDepartments] = React.useState<JSX.Element[]>([]);
  const [empGrps, setEmpGrps] = React.useState<JSX.Element[]>([]);
  const [typeOfRequests, setTypeOfRequests] = React.useState<JSX.Element[]>([]);
  const [reqMinDate, setReqMinDate] = React.useState<Date>(new Date());
  const [currDate, setCurrDate] = React.useState<Date>(new Date());
  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});
  const { values, setFieldValues, webPartProps, currentStep } = props;

  const handleInputChange = (event: any) => {
    let { name, value } = event.target;
    if (name == "empGrp" || name == "typeOfRequest" || name == "reqDep") {
      value = Number(value);
    }
    setFieldValues(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  React.useEffect(() => {
    setReqMinDate(addBusinessDays(
      Number(props?.configpermission?.expediteddays)
    ));

    setCurrDate(new Date());

    getDepartmentValues();
    if (values.formMode === "new") {
      getRequestCount();
    }

    getTypeOfReqs();
    getEmployeeGrps();
  }, [props?.configpermission.expediteddays]);

  const addBusinessDays = (noOfDays: number): Date => {
    const result = new Date();
    let addedDays = 0;

    while (addedDays < noOfDays) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        addedDays++;
      }
    }

    return result;
  };

  const getDepartmentValues = async () => {
    try {
      const items = await web.lists
        .getByTitle("Departments")
        .items
        .filter("IsActive eq 'Yes'")
        .select("Id", "Title")
        .orderBy("Title", true)
        .top(1000)
        .get();

      const deptElements = items.map((department: any) => (
        <option key={department.Id} value={department.Id}>
          {department.Title}
        </option>
      ));
      setDepartments(deptElements);
    } catch (err: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getDepartmentValues", err.status || "Error", LogLevel.Error, err.message);
      console.log(err);
    }
  };
  const getEmployeeGrps = async () => {
    try {
      const items = await web.lists
        .getByTitle("Employer Group")
        .items
        .filter("IsActive eq 'Yes'")
        .select("Id", "Title")
        .orderBy("Title", true)
        .top(1000)
        .get();

      const empGrpElements = items.map((empGrp: any) => (
        <option key={empGrp.Id} value={empGrp.Id}>
          {empGrp.Title}
        </option>
      ));
      setEmpGrps(empGrpElements);
    } catch (err: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getEmployeeGrps", err.status || "Error", LogLevel.Error, err.message);
      console.log(err);
    }
  };
  const getTypeOfReqs = async () => {
    try {
      const items = await web.lists
        .getByTitle("Type of Request")
        .items
        .filter("IsActive eq 'Yes'")
        .select("Id", "Title")
        .orderBy("Title", true)
        .top(1000)
        .get();

      const typeOfReqElements = items.map((typeOfReq: any) => (
        <option key={typeOfReq.Id} value={typeOfReq.Id}>
          {typeOfReq.Title}
        </option>
      ));
      setTypeOfRequests(typeOfReqElements);
    } catch (err: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getTypeOfReqs", err.status || "Error", LogLevel.Error, err.message);
      console.log(err);
    }
  };
  const getRequestCount = async () => {
    try {
      const itemCount = await web.lists
        .getByTitle("Requests")
        .select("ItemCount")
        .get();

      props?.setState((prev: any) => ({
        ...prev,
        reqNumber: `${itemCount.ItemCount + 1} - ${values.currentUser?.Title ?? values.currentUser
          }`,
      }));
    } catch (err: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getRequestCount", err.status || "Error", LogLevel.Error, err.message);
      console.log(err);
    }
  };

  const handlePeoplePickerChange = (stateName: string, items: any[]) => {
    setFieldValues(stateName, items);

    // Clear the error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [stateName]: false,
    }));
  };

  const validateFields = () => {
    const newErrors: any = {
      busReq: values.busReq.length === 0,
      reqDep: values.reqDep == 0,
      reqName: values.reqName.length === 0,
      busNeed: values.busNeed.length === 0,
      expeditedReqDesc: (values.expeditedReqDesc == undefined || values.expeditedReqDesc?.length == 0) && values.reqDueDate != null && values.reqDueDate <= reqMinDate,
      repDescrip: values?.repDescrip?.length == 0,
      isExistingReport: values.isExistingReport === undefined || values.isExistingReport.length === 0,
      reqDueDate: values.reqDueDate === null,
      typeOfRequest: values.typeOfRequest === 0,
      repDist: values.repDist.length === 0,
      legalAgremnt: (values.repDist === "Both Internal and External" || values.repDist === "External Use Only") && values.legalAgremnt.length === 0,

      appNeeded: props?.configpermission?.IsApprovalNeeded.toLowerCase() === "yes" && values.appNeeded.length === 0,
      selectAppr: values.appNeeded.toLowerCase() === "yes" && values.selectAppr.length === 0,
      RegulatoryCompliance: values.RegulatoryCompliance === "0",
      QualityHealthOutcome: values.RegulatoryCompliance?.toLowerCase() === "no" && values.QualityHealthOutcome === "0",
      MedicalCostreduction: values.RegulatoryCompliance?.toLowerCase() === "no" && values.MedicalCostreduction === "0",
      MarketShare: values.RegulatoryCompliance?.toLowerCase() === "no" && values.MarketShare === "0",
      ProviderVitality: values.RegulatoryCompliance?.toLowerCase() === "no" && values.ProviderVitality === "0",
      MemberEngagement: values.RegulatoryCompliance?.toLowerCase() === "no" && values.MemberEngagement === "0",
    };
    if (checkreqdep === "Sales") {
      newErrors.empGrp = values.empGrp == 0 ? true : false
    }
    if (((values.repDist === "External Use Only" &&
      values.legalAgremnt.toLowerCase() === "yes") || (values.repDist === "Internal Use Only") || (values.repDist === "Both Internal and External" &&
        values.legalAgremnt !== ""))) {
      newErrors.shdVIPInfo = props?.configpermission?.EnableVIPRequired.toLowerCase() === "yes" && values.shdVIPInfo.length === 0,
        newErrors.viptextInfo = (values.repDist === "External Use Only" ||
          values.repDist === "Both Internal and External" ||
          values.repDist === "Internal Use Only") &&
        values.shdVIPInfo.toLowerCase() === "yes" && values.viptextInfo?.length == 0,
        newErrors.shdPHIInfo = props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes" &&
        props?.configpermission?.EnablePHIInfoRequired.toLowerCase() === "yes" && values.shdPHIInfo.length === 0,
        newErrors.phiplltextInfo = (((values.repDist === "External Use Only" ||
          values.repDist === "Both Internal and External") &&
          props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes" &&
          values.legalAgremnt.toLowerCase() === "yes" &&
          values.shdPHIInfo.toLowerCase() === "yes") || ((values.repDist === "Internal Use Only" ||
            values.repDist === "Both Internal and External") &&
            values.shdPHIInfo.toLowerCase() === "yes" &&
            props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes")) && values.phiplltextInfo?.length == 0,
        newErrors.shdSensitiveInfo =
        values.shdSensitiveInfo?.length == 0
      newErrors.senscondtextInfo = ((values.repDist === "External Use Only" ||
        values.repDist === "Both Internal and External" ||
        values.repDist === "Internal Use Only") &&
        values.shdSensitiveInfo.toLowerCase() === "yes" && values?.senscondtextInfo?.length == 0)

    }
    setErrors(newErrors)
  };

  React.useEffect(() => {
    if (values.buttonClick === 1) {
      validateFields();
    }
  }, [values.isValidError]);

  if (currentStep !== 1 && values.formMode !== "view") {
    return null;
  }

  let findreqdep;
  let findempgrp;
  let findregcompliance;
  let checkreqdep = "";
  let checkempgrp = "";
  let checkregcompliance = "";

  if (values.reqDep === 0) {
    console.log("Loading values.RegulatoryCompliance 1");
  } else {
    console.log("Loading values.RegulatoryCompliance 2");
    findreqdep = departments.find((x) => x.props.value == values.reqDep);
    if (findreqdep !== undefined) {
      checkreqdep = findreqdep.props.children;
      values.reqDepName = checkreqdep;
    }
  }

  if (values.empGrp === 0) {
  } else {
    findempgrp = empGrps.find((x) => x.props.value == values.empGrp);
    if (findempgrp !== undefined) {
      checkempgrp = findempgrp.props.children;
    }
  }

  return (
    <div className="clearFields mainDiv">
      <details className="SidebarAccordion" open>
        <summary className="check-list-header">Request Details</summary>
        <div className="expand-AccordionContent clearfix">
          <div className="row clearFields mb-3">
            <div className="col-md-4">
              <label className='form-label w-100'>
                {" "}
                Created By<span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <input
                  type="text"
                  name="requesterName"
                  disabled
                  id="txtReqName"
                  className=" form-control"
                  value={
                    values.currentUser.Title == undefined
                      ? values.currentUser
                      : values.currentUser.Title
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className='form-label w-100'>
                {" "}
                Request Date<span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <DatePicker
                  value={values.reqDate}
                  disabled
                  className="dpicker "
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className='form-label w-100'>
                {" "}
                Request No<span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <input
                  type="text"
                  name="reqNumber"
                  id="txtReqNo"
                  value={values.reqNumber}
                  disabled
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row clearFields mb-3">
            <div className="col-md-4">
              <label className='form-label w-100 flexMiddle gap-1'>
                <span>Business Requestor
                  <span className="ReqField">*</span></span>
                <CustomToolTip richText={true} Description={"<b>Business Requestor</b> The Business Requestor is the person for whom the Request will be created"}
                />
              </label>
              <div className="inputDiv">
                <PeoplePicker
                  context={webPartProps.context}
                  titleText=""
                  personSelectionLimit={1}
                  groupName={""}
                  required={false}
                  ensureUser={true}
                  onChange={handlePeoplePickerChange.bind(
                    null,
                    "busReq"
                  )}
                  showHiddenInUI={false}
                  principalTypes={[PrincipalType.User]}
                  resolveDelay={1000}
                  defaultSelectedUsers={[
                    values.busReq.length !== 0
                      ? values.busReq[0].secondaryText == undefined
                        ? values.busReq[0].EMail
                        : values.busReq[0].secondaryText
                      : "",
                  ]}
                  disabled={values.formMode === "view"}
                />
                {errors.busReq && (
                  <div className="errorMessage">
                    Field is required
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <label className='form-label w-100'>
                Requestor's Department
                <span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <select
                  name="reqDep"
                  className="fields form-control"
                  value={values.reqDep}
                  onChange={handleInputChange}
                >
                  <option value={0}>Select</option>
                  {departments}
                </select>
                {errors.reqDep && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>
            </div>
            {checkreqdep === "Sales" && <div className="col-md-4">
              <label className='form-label w-100'>
                Employer Group<span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <select
                  name="empGrp"
                  className="fields form-control"
                  value={values.empGrp}
                  onChange={handleInputChange}
                  disabled={values.formMode === "view"}
                >
                  <option value={0}>Select</option>
                  {empGrps}
                </select>
                {errors.empGrp && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>
            </div>}
            {checkempgrp === "Other" && <div

            >
              <div className="row">
                <label className='form-label w-100'>
                  Employer Group Other
                  <span className="ReqField">*</span>
                </label>
                <div className="inputDiv">
                  <input
                    type="text"
                    name="empgrpother"
                    value={values.empgrpother}
                    id="empgrpother"
                    onChange={handleInputChange}
                    maxLength={100}
                    className="form-control"
                  />
                  {errors.empgrpother && (
                    <div className="errorMessage">Field is required</div>
                  )}
                </div>
              </div>
            </div>}
          </div>
          <div className="row clearFields mb-3">
            <div className="col-md-4">
              <label className='form-label w-100'>
                Request Name
                <span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <input
                  type="text"
                  name="reqName"
                  value={values.reqName}
                  id="txtreqName"
                  onChange={handleInputChange}
                  maxLength={100}
                  className="form-control"
                />
                {errors.reqName && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <label className='form-label w-100'>
                Is this a new or existing request?
                <span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <span className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="isExistingReport"
                    value="New"
                    checked={values.isExistingReport === "New"}
                    onChange={handleInputChange}
                  />
                  <span>New</span>
                </span>
                <span className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="isExistingReport"
                    value="Existing"
                    checked={values.isExistingReport === "Existing"}
                    onChange={handleInputChange}
                  />
                  <span>Existing</span>
                </span>
                {errors.isExistingReport && (
                  <div className="errorMessage">
                    Field is required
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <label className='form-label w-100'>Tracking ID/Name</label>
              <div className="inputDiv">
                <input
                  type="text"
                  name="trackingId"
                  value={values.trackingId}
                  id="txtRepName"
                  onChange={handleInputChange}
                  maxLength={100}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row clearFields ">
            <div className="col-md-6 mb-3">
              <label className='form-label w-100 flexMiddle gap-1'>
                Requested Due Date
                <span className="ReqField">*</span>
                <CustomToolTip richText={true} Description={" <b>Requested Due Date</b> This date should reflect when the business requestor ideally would like to receive the Request. If the date is not viable the Business Requestor will be contacted. Minimum of 4 business days from today's date."} />
              </label>
              <div className="inputDiv viewMode">
                <DatePicker
                  disabled={values.formMode === "view"}
                  label=""
                  value={values.reqDueDate}
                  onSelectDate={(val) =>
                    setFieldValues("reqDueDate", val)
                  }
                  minDate={currDate}
                  className="fields viewMode "
                />
                {errors.reqDueDate && values.reqDueDate === null && (
                  <div className="errorMessage">
                    Field is required
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className='form-label w-100'>
                Type of Request<span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <select
                  name="typeOfRequest"
                  className="form-control"
                  value={values.typeOfRequest}
                  onChange={handleInputChange}
                >
                  <option value={0}>Select</option>
                  {typeOfRequests}
                </select>
                {errors.typeOfRequest && (
                  <div className="errorMessage">
                    Field is required
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            {values.reqDueDate != null &&
              values.reqDueDate <= reqMinDate && <div className="clearFields mb-3">
                <label className='form-label w-100'>
                  Explanation of expedited request
                  <span className="ReqField">*</span>
                </label>
                <div className="inputDiv">
                  <textarea
                    className="form-control"
                    rows={4}
                    name="expeditedReqDesc"
                    value={
                      values.reqDueDate <= reqMinDate
                        ? values.expeditedReqDesc
                        : ""
                    }
                    onChange={handleInputChange}
                    disabled={values.formMode === "view"}
                  ></textarea>
                  {errors.expeditedReqDesc && (
                    <div className="errorMessage">
                      Field is required
                    </div>
                  )}
                </div>
              </div>}
            <div className="clearFields mb-3">
              <label className='form-label w-100'>
                What question/problem are you trying to answer?
                <span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <textarea
                  className="form-control"
                  name="repDescrip"
                  rows={4}
                  onChange={handleInputChange}
                  value={values.repDescrip}
                ></textarea>
                {errors.repDescrip && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>
            </div>
            <div className="clearFields mb-3">
              <label className='form-label w-100'>Intended Use (please indicate meeting date if for an upcoming meeting)</label>
              <div className="inputDiv">
                <textarea
                  className="form-control"
                  name="intendedUse"
                  rows={4}
                  onChange={handleInputChange}
                  value={values.intendedUse}
                ></textarea>
              </div>
            </div>
            <div className="clearFields mb-3">
              <label className='form-label w-100'>
                {" "}
                Request Requirements
                <span className="ReqField">*</span>
              </label>
              <div className="inputDiv">
                <textarea
                  className="form-control"
                  name="busNeed"
                  rows={4}
                  onChange={handleInputChange}
                  value={values.busNeed}
                ></textarea>
                {errors.busNeed && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>
            </div>
          </div>
          {values.devExplain && <div >
            <label className='form-label w-100'>
              {" "}
              Request Scope Changes
              <span className="ReqField">*</span>
            </label>
            <div className="inputDiv">
              <textarea
                className="form-control"
                name="devExplain"
                rows={4}
                onChange={handleInputChange}
                value={values.devExplain}
              ></textarea>
              {errors.devExplain && (
                <div className="errorMessage">Field is required</div>
              )}
            </div>
          </div>}
        </div>
      </details>
      <details className="SidebarAccordion" open>
        <summary className="check-list-header"> Report Distribution</summary>
        <div className="expand-AccordionContent clearfix">
          <div className="clearFields  col-md-12 mb-2">
            <label className='form-label w-100'>
              Report Distribution
              <span className="ReqField">*</span>
            </label>
            <div className="">
              <div className="boolLbl">
                <div className="form-check">
                  <input className="form-check-input"
                    type="radio"
                    name="repDist"
                    value="Internal Use Only"
                    checked={values.repDist === "Internal Use Only"}
                    onChange={handleInputChange}
                  />
                  <span>Internal Use Only</span>
                </div>
              </div>
              <div className="boolLbl">
                <div className="form-check">
                  <input className="form-check-input"
                    type="radio"
                    name="repDist"
                    value="External Use Only"
                    checked={values.repDist === "External Use Only"}
                    onChange={handleInputChange}
                  />
                  <span>External Use Only</span>
                </div>
              </div>
              <div className="boolLbl">
                <div className="form-check">
                  <input className="form-check-input"
                    type="radio"
                    name="repDist"
                    value="Both Internal and External"
                    checked={values.repDist === "Both Internal and External"}
                    onChange={handleInputChange}
                  />
                  <span>Both Internal and External</span>
                </div>
              </div>
            </div>
            {errors.repDist && (
              <div className="errorMessage">Field is required</div>
            )}
          </div>
          {(values.repDist === "Both Internal and External" ||
            values.repDist === "External Use Only") && <div>
              <div className=" mb-2">
                <label className="form-label w-100 flexMiddle gap-1">
                  {" "}
                  Do you have a Business Associate Agreement?
                  <span className="ReqField">*</span>
                  <CustomToolTip richText={true} Description={"<b>Business associate</b> </br> is a person or entity (or other subcontractor) that performs or assists in the function or activity on My Health’s behalf and creates, receives, maintains or transmits protected health information to perform claims processing or administration, data analysis, data processing, data administration, utilization review, quality assurance, patient safety activities, billing, benefit management, practice management, repricing or another activity related to My Health or another covered entity’s treatment, payment or healthcare operations. A business associate also includes a person or entity (or their subcontractor) that provides legal, actuarial, accounting, consulting, data aggregation, management, administrative, accreditation, or financial services to or for My Health when the service involves the disclosure of health information from Independent Health or one of its business associates. Finally, a business associate includes the following types of persons or entities (or their subcontractors): patient safety organizations, health information organizations, e-prescribing gateways, other entity’s that provide data transmission services to My Health with respect to protected health information and that require access to such protected health information on a routine basis."} />

                </label>
                <div className="">
                  <span className="boolLbl form-check form-check-inline">
                    <input className="form-check-input"
                      type="radio"
                      name="legalAgremnt"
                      value="Yes"
                      checked={values.legalAgremnt.toLowerCase() === "yes"}
                      onChange={handleInputChange}
                    />
                    <span>Yes</span>
                  </span>
                  <span className="boolLbl form-check form-check-inline">
                    <input className="form-check-input"
                      type="radio"
                      name="legalAgremnt"
                      value="No"
                      checked={values.legalAgremnt?.toLowerCase() === "no"}
                      onChange={handleInputChange}
                    />
                    <span>No</span>
                  </span></div>
                {values.legalAgremnt?.toLowerCase() === "no" &&
                  values.repDist === "Both Internal and External" && <div
                    className={
                      values.legalAgremnt?.toLowerCase() === "no" &&
                        values.repDist === "Both Internal and External"
                        ? "siteColor"
                        : ""
                    }
                  >
                    <span className="bold">Note: </span>
                    Request will be created for Internal Use Only.
                  </div>}
                {values.legalAgremnt?.toLowerCase() === "no" &&
                  values.repDist === "External Use Only" && <div
                    className={
                      values.legalAgremnt?.toLowerCase() === "no" &&
                        values.repDist === "External Use Only"
                        ? "red"
                        : ""
                    }
                  >
                    <span className="bold">Note: </span>
                    This request will not move forward without the Business
                    Associate Agreement in place. Once you establish the
                    agreement, you may come back and resubmit the request.
                  </div>}
                {errors.legalAgremnt && (
                  <div className="errorMessage clearFields test9">
                    Field is required
                  </div>
                )}
              </div>
            </div>}
          {((values.repDist === "External Use Only" &&
            values.legalAgremnt.toLowerCase() === "yes") || (values.repDist === "Internal Use Only") || (values.repDist === "Both Internal and External" &&
              values.legalAgremnt !== "")) &&
            <div>
              {props?.configpermission?.EnableVIPRequired.toLowerCase() === "yes" && <div className="mb-2">
                <label className='form-label w-100 flexMiddle gap-1'>
                  Do You Require VIP information?
                  <span className="ReqField">*</span>

                  <CustomToolTip richText={true} Description={"<b>VIP</b> <br />A status used to identify confidential members, such as My Health employees, board members, vendors and practitioners."} />
                </label>
                <div className="">
                  <span className="boolLbl form-check form-check-inline">
                    <input className="form-check-input"
                      type="radio"
                      name="shdVIPInfo"
                      value="Yes"
                      checked={values.shdVIPInfo?.toLowerCase() === "yes"}
                      onChange={handleInputChange}
                    />
                    <span>Yes</span>
                  </span>
                  <span className="boolLbl form-check form-check-inline">
                    <input className="form-check-input"
                      type="radio"
                      name="shdVIPInfo"
                      value="No"
                      checked={values.shdVIPInfo?.toLowerCase() === "no"}
                      onChange={handleInputChange}
                    />
                    <span> No</span>
                  </span>
                </div>
                {errors.shdVIPInfo && (
                  <div className="errorMessage">Field is required</div>
                )}
              </div>}
              {(values.repDist === "External Use Only" ||
                values.repDist === "Both Internal and External" ||
                values.repDist === "Internal Use Only") &&
                values.shdVIPInfo.toLowerCase() === "yes" && <div className="mb-2">
                  <label className='form-label w-100'>
                    Why VIP is Required?
                    <span className="ReqField">*</span>
                  </label>
                  <div className="inputDiv">
                    <textarea
                      name="viptextInfo"
                      id="viptextInfo"
                      value={values.viptextInfo}
                      onChange={handleInputChange}
                      className="form-control"
                    ></textarea>
                    {errors.viptextInfo && (
                      <div className="errorMessage test7">
                        Field is required
                      </div>
                    )}
                  </div>
                </div>}
              {props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes" &&
                props?.configpermission?.EnablePHIInfoRequired.toLowerCase() === "yes" && <div className="mb-2">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Do You Require PHI/PII?
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Personally identifiable information (PII)</b> is any information about an individual maintained by My Health, including but not limited to (1) any information that can be used to distinguish or trace an individual’s identity such as name, social security number, date and place of birth, mother’s maiden name or biometric records; and (2) any other information that is linked or linkable to an individual, such as medical, educational, financial, and employment information. <br /> <b>Protected health information (PHI)</b> <br /> is individually identifiable health information that is transmitted or maintained by My Health in any form. Individually identifiable health information is health information that is created or received by My Health, that relates to the physical or mental health or condition of a member or to the provision of health care to the member or the payment for such health care, and that identifies the member"} />
                  </label>
                  <div className="">
                    <span className="boolLbl form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="shdPHIInfo"
                        value="Yes"
                        checked={values.shdPHIInfo.toLowerCase() === "yes"}
                        onChange={handleInputChange}
                      />
                      <span>Yes</span>
                    </span>
                    <span className="boolLbl form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="shdPHIInfo"
                        value="No"
                        checked={values.shdPHIInfo?.toLowerCase() === "no"}
                        onChange={handleInputChange}
                      />
                      <span> No</span>
                    </span>
                  </div>
                  {errors.shdPHIInfo && (
                    <div className="errorMessage">Field is required</div>
                  )}
                </div>}
              {(((values.repDist === "External Use Only" ||
                values.repDist === "Both Internal and External") &&
                props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes" &&
                values.legalAgremnt.toLowerCase() === "yes" &&
                values.shdPHIInfo.toLowerCase() === "yes") || ((values.repDist === "Internal Use Only" ||
                  values.repDist === "Both Internal and External") &&
                  values.shdPHIInfo.toLowerCase() === "yes" &&
                  props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes")) && <div className="mb-2">
                  <label className='form-label w-100'>
                    Why PHI/PII is Required?
                    <span className="ReqField">*</span>
                  </label>
                  <div className="inputDiv">
                    <textarea
                      name="phiplltextInfo"
                      id="phiplltextInfo"
                      value={values.phiplltextInfo}
                      onChange={handleInputChange}
                      className="form-control"
                    ></textarea>
                    {errors.phiplltextInfo && (
                      <div className="errorMessage test6">
                        Field is required
                      </div>
                    )}
                  </div>
                </div>}
              {props?.configpermission?.EnableReportDistributionCondition.toLowerCase() === "yes" &&
                props?.configpermission?.EnableSensitiveInfoRequired.toLowerCase() === "yes" && <div className="mb-2">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Do You Require Sensitive Conditions?
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Sensitive Conditions</b> <br /> The State and Federal Government defines the categories of what is considered a Sensitive Condition – HIV, Mental Health, Obstetrics, Infectious Diseases, Chemical Dependency, and Genetics. For more information refer to the policy: <b>Use and Disclosure of PHI and PII</b>"} />
                  </label>
                  <div className="">
                    <span className="boolLbl form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="shdSensitiveInfo"
                        value="Yes"
                        checked={values.shdSensitiveInfo?.toLowerCase() === "yes"}
                        onChange={handleInputChange}
                      />
                      <span>Yes</span>
                    </span>
                    <span className="boolLbl form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="shdSensitiveInfo"
                        value="No"
                        checked={values.shdSensitiveInfo.toLowerCase() === "no"}
                        onChange={handleInputChange}
                      />
                      <span> No</span>
                    </span>
                  </div>
                  {errors.shdSensitiveInfo && (
                    <div className="errorMessage">Field is required</div>
                  )}
                </div>}
              {(values.repDist === "External Use Only" ||
                values.repDist === "Both Internal and External" ||
                values.repDist === "Internal Use Only") &&
                values.shdSensitiveInfo.toLowerCase() === "yes" && <div className="mb-2">
                  <label className='form-label w-100'>
                    Why do Sensitive Conditions need to be visible?
                    <span className="ReqField">*</span>
                  </label>
                  <div className="inputDiv">
                    <textarea
                      name="senscondtextInfo"
                      id="senscondtextInfo"
                      value={values.senscondtextInfo}
                      onChange={handleInputChange}
                      className="form-control"
                    ></textarea>
                    {errors.senscondtextInfo && (
                      <div className="errorMessage clearFields test4">
                        Field is required
                      </div>
                    )}
                  </div>
                </div>}
            </div>}
          {props?.configpermission?.IsApprovalNeeded.toLowerCase() === "yes" && <div className="mb-2">
            <label className='form-label w-100'>
              Approval Needed
              <span className="ReqField">*</span>
            </label>
            <div className="">
              <span className="boolLbl form-check form-check-inline">
                <input className="form-check-input"
                  type="radio"
                  name="appNeeded"
                  value="Yes"
                  checked={values.appNeeded?.toLowerCase() === "yes"}
                  onChange={handleInputChange}
                />
                <span>Yes</span>
              </span>
              <span className="form-check form-check-inline">
                <input className="form-check-input"
                  type="radio"
                  name="appNeeded"
                  value="No"
                  checked={values.appNeeded?.toLowerCase() === "no"}
                  onChange={handleInputChange}
                />
                <span>No</span>
              </span>
              <div className="red ">
                <span className='form-label w-100'>Note: </span>
                Please ensure you know your department's 'Approval'
                requirements!
              </div>
              {errors.appNeeded && (
                <div className="errorMessage marginRightDiv clearFields">
                  Field is required
                </div>
              )}
            </div>
          </div>}
          {values.appNeeded.toLowerCase() === "yes" && <div className="mb-2">
            <label className='form-label w-100'>
              Select Approver
              <span className="ReqField">*</span>
            </label>
            <div className="inputDiv">
              <PeoplePicker
                context={webPartProps.context}
                titleText=""
                personSelectionLimit={1}
                groupName={""}
                showtooltip={values.buttonClick === 1}
                required={values.buttonClick === 1}
                ensureUser={true}
                onChange={handlePeoplePickerChange.bind(
                  null,
                  "selectAppr"
                )}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
                defaultSelectedUsers={[
                  values.selectAppr.length !== 0
                    ? values.selectAppr[0].secondaryText == undefined
                      ? values.selectAppr[0].EMail
                      : values.selectAppr[0].secondaryText
                    : "",
                ]}
              />
              {errors.selectAppr && (
                <div className="errorMessage">Field is required</div>
              )}
            </div>
          </div>}
        </div>
      </details>

      {checkreqdep !== "Sales" &&
        <details className="SidebarAccordion" open>
          <summary className="check-list-header">Buisness Value</summary>
          <div className="expand-AccordionContent clearfix">
            <div className="row">
              <div className="col-md-4 mb-2">
                <label className="form-label w-100 flexMiddle gap-1">
                  Regulatory Compliance
                  <span className="ReqField">*</span>
                  <CustomToolTip richText={true} Description={"<b>Regulatory Compliance</b> <br />Is this request due to a mandate from a government or regulating body?"} />
                </label>
                <div className="inputDiv">
                  <select
                    name="RegulatoryCompliance"
                    className="form-control"
                    value={values.RegulatoryCompliance}
                    onChange={handleInputChange}
                  >
                    <option value={"0"}>Select</option>
                    <option value={"Yes"}>Yes</option>
                    <option value={"No"}>No</option>
                  </select>
                  {errors.RegulatoryCompliance && (
                    <div className="errorMessage">Field is required</div>
                  )}
                </div>
              </div>

              {values.RegulatoryCompliance?.toLowerCase() === "no" &&
                <div className="mb-2 col-md-4">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Quality/ Health Outcomes
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Quality/ Health Outcomes</b> <br /> Will this improve quality measures and health outcomes?"} />
                  </label>
                  <div className="inputDiv">
                    <select
                      name="QualityHealthOutcome"
                      className="form-control"
                      value={values.QualityHealthOutcome}
                      onChange={handleInputChange}
                    >
                      <option value={"0"}>Select</option>
                      <option value={"N/A"}>0 – N/A</option>
                      <option value={"Slightly"}>1 – Slightly</option>
                      <option value={"Moderately"}>2 – Moderately</option>
                      <option value={"Significantly"}>3 – Significantly</option>
                    </select>
                    {errors.QualityHealthOutcome && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                </div>
              }
              {values.RegulatoryCompliance?.toLowerCase() === "no" &&
                <div className="mb-2 col-md-4">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Medical Cost Reduction
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Medical Cost Reduction</b> <br />  Will this reduce medical costs?"} />
                  </label>
                  <div className="inputDiv">
                    <select
                      name="MedicalCostreduction"
                      className="form-control"
                      value={values.MedicalCostreduction}
                      onChange={handleInputChange}
                    >
                      <option value={"0"}>Select</option>
                      <option value={"N/A"}>0 – N/A</option>
                      <option value={"Slightly"}>1 – Slightly</option>
                      <option value={"Moderately"}>2 – Moderately</option>
                      <option value={"Significantly"}>3 – Significantly</option>
                    </select>
                    {errors.MedicalCostreduction && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                </div>
              }
              {values.RegulatoryCompliance?.toLowerCase() === "no" &&
                <div className="mb-2 col-md-4">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Market Share
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Market Share</b> <br />   Will this help increase our membership?"} />
                  </label>
                  <div className="inputDiv">
                    <select
                      name="MarketShare"
                      className="form-control"
                      value={values.MarketShare}
                      onChange={handleInputChange}
                    >
                      <option value={"0"}>Select</option>
                      <option value={"N/A"}>0 – N/A</option>
                      <option value={"Slightly"}>1 – Slightly</option>
                      <option value={"Moderately"}>2 – Moderately</option>
                      <option value={"Significantly"}>3 – Significantly</option>
                    </select>
                    {errors.MarketShare && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                </div>
              }
              {values.RegulatoryCompliance?.toLowerCase() === "no" &&
                <div className="mb-2 col-md-4">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Provider Vitality
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Provider Vitality</b> <br />  Will this improve provider satisfaction?"} />
                  </label>
                  <div className="inputDiv">
                    <select
                      name="ProviderVitality"
                      className="form-control"
                      value={values.ProviderVitality}
                      onChange={handleInputChange}
                    >
                      <option value={"0"}>Select</option>
                      <option value={"N/A"}>0 – N/A</option>
                      <option value={"Slightly"}>1 – Slightly</option>
                      <option value={"Moderately"}>2 – Moderately</option>
                      <option value={"Significantly"}>3 – Significantly</option>
                    </select>
                    {errors.ProviderVitality && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                </div>
              }
              {values.RegulatoryCompliance?.toLowerCase() === "no" &&
                <div className="col-md-4 mb-2">
                  <label className='form-label w-100 flexMiddle gap-1'>
                    Member Engagement
                    <span className="ReqField">*</span>
                    <CustomToolTip richText={true} Description={"<b>Member Engagement</b> <br />   Will this increase member engagement and satisfaction?"} />
                  </label>
                  <div className="inputDiv">
                    <select
                      name="MemberEngagement"
                      className="form-control"
                      value={values.MemberEngagement}
                      onChange={handleInputChange}
                    >
                      <option value={"0"}>Select</option>
                      <option value={"N/A"}>0 – N/A</option>
                      <option value={"Slightly"}>1 – Slightly</option>
                      <option value={"Moderately"}>2 – Moderately</option>
                      <option value={"Significantly"}>3 – Significantly</option>
                    </select>
                    {errors.MemberEngagement && (
                      <div className="errorMessage">Field is required</div>
                    )}
                  </div>
                </div>}
            </div>
          </div>
        </details>}
    </div>
  );
};

export default React.memo(InformationStep);
