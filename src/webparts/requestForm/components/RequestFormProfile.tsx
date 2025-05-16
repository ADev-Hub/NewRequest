import { useState, useEffect, useRef } from "react";
import * as React from 'react';
import * as util from '../../../Util';
import InformationStep from "./steps/InformationStep";
import DetailedDescStep from "./steps/DetailedDescStep";
import ExecDeliveryReq from "./steps/ExecDeliveryReq";
// import { ReportType } from "./steps/ReportType";
import { LogLevel } from '@pnp/logging';
import { Dialog, DialogType, DialogFooter, PrimaryButton } from "office-ui-fabric-react";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import PageLoader from "../../../GlobalComponent/PageLoader";
import { Web } from "sp-pnp-js";
import * as $ from 'jquery';
import CustomModal from "../../../GlobalComponent/CustomModal";
import * as moment from "moment";
interface IRequestFormState {
  formMode: any
  currentUser: string;
  existingAddComments: string;
  isExistingReport: string;
  reqDate: Date;
  currentStep: number;
  strategy: string;
  reqNumber: string;
  busReq: any[];
  busRec: any[];
  reqDep: number;
  repName: string;
  expeditedReqDesc: string;
  reqDueDate: Date | null;
  minDueDate: Date | null;
  repDescrip: string;
  busNeed: string;
  intendedUse: string;
  repDist: string;
  shdVIPInfo: string;
  shdPHIInfo: string;
  shdSensitiveInfo: string;
  phiplltextInfo: string;
  viptextInfo: string;
  senscondtextInfo: string;
  legalAgremnt: string;
  isQM: boolean;
  isTheMiniNecesry: string;
  appNeeded: string;
  selectAppr: any[];
  outPutFormat: any;
  outputFormatText: string;
  repLayout: number;
  delOptionIntrnl: string;
  cognFoldrName: string;
  delOptionOthr: string;
  reportFrqncy: number;
  autoSchRec: string;
  recurrenceDaily: string;
  dailyEveryDayRecur: string;
  weekRecurrence: string;
  selectedWeekRecurrences: string;
  monthOccurence: string;
  buttonClick: number;
  attachments: any[];
  attachedFiles: any[];
  hideDialog: boolean;
  trackingId: string;
  empGrp: number;
  typeOfRequest: number;
  recurrenceMonthly: string;
  monthlyMonthRecur: string;
  monthlyDayRecur: string;
  monthlySelectedDay1: string;
  monthlySelectedDay2: string;
  checkuserdata: number[];
  brManager: number;
  reqName: string;
  disablebtn: boolean;
  isValidError: boolean;
  prevComment: string;
  empgrpother: string;
  status: string;
  QualityHealthOutcome: string;
  MarketShare: string;
  MedicalCostreduction: string;
  MemberEngagement: string;
  ProviderVitality: string;
  RegulatoryCompliance: string;
  LevelOfComplexity: string;
  ConfidenceLevel: string;
  WorkingMonth: string;
  LevelOfComplexityChoices: string[];
  ConfidenceLevelChoices: string[];
  YearMonthChoices: string[];
  reqDepName: any
  fileCount: any
}
let copyConfigpermission: any
const RequestFormProfile = (props: any) => {
  let reqMinDate = new Date();
  const web = new Web(props?.props?.siteUrl);
  const [state, setState] = useState<IRequestFormState>({
    currentUser: "",
    fileCount: 0,
    reqDepName: "",
    formMode: "",
    existingAddComments: "",
    isExistingReport: "",
    reqDate: new Date(),
    currentStep: 1,
    strategy: "",
    reqNumber: "",
    busReq: [],
    busRec: [],
    reqDep: 0,
    repName: "",
    expeditedReqDesc: "",
    reqDueDate: null,
    minDueDate: null,
    repDescrip: "",
    busNeed: "",
    intendedUse: "",
    repDist: "",
    shdVIPInfo: "",
    shdPHIInfo: "",
    shdSensitiveInfo: "",
    phiplltextInfo: "",
    viptextInfo: "",
    senscondtextInfo: "",
    legalAgremnt: "",
    isQM: false,
    isTheMiniNecesry: "",
    appNeeded: "",
    selectAppr: [],
    outPutFormat: "",
    outputFormatText: "",
    repLayout: 0,
    delOptionIntrnl: "",
    cognFoldrName: "",
    delOptionOthr: "",
    reportFrqncy: 1,
    autoSchRec: "Daily",
    recurrenceDaily: "",
    dailyEveryDayRecur: "",
    weekRecurrence: "",
    selectedWeekRecurrences: "",
    monthOccurence: "",
    buttonClick: 0,
    attachments: [],
    attachedFiles: [],
    hideDialog: true,
    trackingId: "",
    empGrp: 0,
    typeOfRequest: 0,
    recurrenceMonthly: "",
    monthlyMonthRecur: "",
    monthlyDayRecur: "",
    monthlySelectedDay1: "",
    monthlySelectedDay2: "",
    checkuserdata: [],
    brManager: 0,
    reqName: "",
    disablebtn: false,
    isValidError: true,
    prevComment: "",
    empgrpother: "",
    status: "",
    QualityHealthOutcome: "0",
    MarketShare: "0",
    MedicalCostreduction: "0",
    MemberEngagement: "0",
    ProviderVitality: "0",
    RegulatoryCompliance: "0",
    LevelOfComplexity: "0",
    ConfidenceLevel: "0",
    WorkingMonth: "0",
    LevelOfComplexityChoices: [],
    ConfidenceLevelChoices: [],
    YearMonthChoices: [],
  });

  const _topElement = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filesUpdated, setFilesUpdated] = useState(false);
  const itemId = new URLSearchParams(window.location.search).get("ItemId") || "";
  const pageMode = (new URLSearchParams(window.location.search).get("PageMode") || "new").toLowerCase();
  const [configpermission, setConfigPermission]: any = useState()
  useEffect(() => {
    getConfigValues();

    GetChoiceValues()

  }, []);

  const getLoggedInUserDetails = async () => {
    try {
      const currentUser = await web.currentUser.get();

      getLoggedInUserGroups(currentUser);
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "getLoggedInUserDetails", error.status.toString(), LogLevel.Error, error.responseText);
    }
  };

  const getLoggedInUserGroups = async (currentUser: any) => {
    try {
      const userGroups = await web.getUserById(currentUser?.Id).groups.get();
      const qmGrp = userGroups.filter((x: any) => x.Id == copyConfigpermission?.QMGrpId);
      reqMinDate = addBusinessDays(copyConfigpermission?.expediteddays)
      if (itemId) {
        bindformValues(itemId);
        if (pageMode === "view") {
          document.querySelectorAll(".viewMode input, .viewMode select, .viewMode textarea").forEach((el) => {
            el.setAttribute("disabled", "true");
          });
          document.querySelectorAll(".errorMessage").forEach((el: any) => {
            el.style.display = "none";
          });
        }
        if (qmGrp.length > 0) {
          setState((prevState: any) => ({
            ...prevState,
            isQM: true,
            userGroups,
            minDueDate: reqMinDate,
            formMode: pageMode,
          }));
        } else {
          setState((prevState: any) => ({
            ...prevState,
            userGroups,

          }));
        }
      } else {
        if (qmGrp.length > 0) {
          setState((prevState: any) => ({
            ...prevState,
            isQM: true,
            userGroups,
            currentUser,

            minDueDate: reqMinDate,
            formMode: pageMode,
          }));
        } else {
          setState((prevState: any) => ({
            ...prevState,
            userGroups,
            currentUser
          }));
        }
      }

    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "getLoggedInUserGroups", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  }

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


  const cancelForm = () => {
    window.location.href = props?.props?.redirectionUrl;
  };

  const _closeDialog = () => {
    setIsLoading(false)
    if (state.isValidError !== true) {
      setState((prevState) => ({
        ...prevState,
        hideDialog: true,
        isValidError: true,
      }));
    } else {
      window.location.href = props?.props?.redirectionUrl;
    }

  };
  const checkBusinessRequestor = async () => {
    try {
      const userid = parseInt(state.busReq[0].id);
      const userloginname = state.busReq[0].loginName;

      const siteUrl = props?.props?.siteUrl;
      const web = new Web(siteUrl);
      const encodedLogin = encodeURIComponent(userloginname);
      const profileUrl: any = `${siteUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='${encodedLogin}'`;

      const profileData = await web.get(profileUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      const managerInfo = profileData.d.UserProfileProperties.results.find((x: any) => x.Key === "Manager");

      if (managerInfo?.Value) {
        const managerLogin = managerInfo.Value;
        const managerUser = await web.siteUsers.getByLoginName(managerLogin).get();
        setState((prevState) => ({
          ...prevState,
          brManager: managerUser.Id,
        }));
      }
      const userGroups = await web.siteUsers.getById(userid).groups.get();
      const userGroupIds = userGroups.map((group: any) => group.Id);

      setState((prevState) => ({
        ...prevState,
        checkuserdata: userGroupIds,
      }));

    } catch (error) {
      console.error("Error in checkBusinessRequestor:", error);
    }
  };

  const _next = () => {
    try {
      let currentStep = 1;
      setState((prevState) => ({
        ...prevState,
        buttonClick: 1,
      }));
      let isValid = true;
      if (pageMode !== "view") {
        setIsLoading(true)
        isValid = ValidateFields();
      }
      if (isValid) {

        if (state.formMode !== "edit") {
          checkBusinessRequestor();
        }
        if (state.formMode === "new" || state.formMode === "edit") {
          createUpdateRequestItem();
        } else {
          currentStep = 1;
        }
        setState((prevState) => ({
          ...prevState,
          currentStep: currentStep,
        }));
        _topElement.current?.scrollIntoView();
      } else {
        setIsLoading(false)
        _topElement.current?.scrollIntoView();

        setState((prevState) => ({
          ...prevState,
          isValidError: isValid,
          hideDialog: false,
        }));
      }
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "_next", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  };

  const _prev = () => {
    try {
      let currentStep = state.currentStep;
      currentStep = currentStep <= 1 ? 1 : currentStep - 1;
      setState((prevState) => ({
        ...prevState,
        currentStep: currentStep,
        buttonClick: currentStep,
      }));
      _topElement.current?.scrollIntoView();
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "_prev", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  };
  const ValidateFields = () => {
    try {
      const isEmpty = (field: any) => field === null || field === undefined || field === 0 || field.length === 0;
      const isReportDistributionConditionValid = (condition: any) => {
        return (state.repDist === "External Use Only" || state.repDist === "Both Internal and External") &&
          copyConfigpermission?.EnableReportDistributionCondition === "Yes" && condition;
      };
      const isVIPInfoRequired = () => {
        return copyConfigpermission?.EnableVIPRequired.toLowerCase() == "yes" &&
          (isEmpty(state.shdVIPInfo) ? true : state.shdVIPInfo === "Yes" && isEmpty(state.viptextInfo));

      };

      const isSensitiveInfoRequired = (field: any) => {
        return copyConfigpermission?.EnableSensitiveInfoRequired.toLowerCase() === "yes" &&
          (isEmpty(state.shdSensitiveInfo) ? true : state.shdSensitiveInfo === "Yes" && isEmpty(field));
      };
      const isPHIInfoRequired = () => {
        return copyConfigpermission?.EnablePHIInfoRequired.toLowerCase() === "yes" &&
          (isEmpty(state.shdPHIInfo) ? true : state.shdPHIInfo === "Yes" && isEmpty(state.phiplltextInfo));
      };
      if (
        isEmpty(state.isExistingReport) ||
        isEmpty(state.busReq) ||
        state.reqDep === null || state.reqDep === 0 || state?.typeOfRequest === 0 ||
        isEmpty(state.reqDate) ||
        isEmpty(state.reqDueDate) ||
        isEmpty(state.repDescrip) ||
        isEmpty(state.busNeed) ||
        isEmpty(state.repDist) ||
        isEmpty(state.reqName) ||
        (state.reportFrqncy === 1 && isEmpty(state.busRec)) ||
        (state.reportFrqncy === 1 && (
          isEmpty(state.autoSchRec) ||
          (state.autoSchRec === "Daily" && (isEmpty(state.recurrenceDaily) ||
            (state.recurrenceDaily === "everyDay" && isEmpty(state.dailyEveryDayRecur)))) ||
          (state.autoSchRec === "Weekly" && (isEmpty(state.weekRecurrence) || isEmpty(state.selectedWeekRecurrences))) ||
          (state.autoSchRec === "Monthly" && (isEmpty(state.recurrenceMonthly) || (
            (state.recurrenceMonthly === "selectedDay" && (isEmpty(state.monthlySelectedDay1) ||
              isEmpty(state.monthlySelectedDay2) || isEmpty(state.monthOccurence))) ||
            (state.recurrenceMonthly === "everyDay" &&
              (isEmpty(state.monthlyDayRecur) || isEmpty(state.monthlyMonthRecur)))
          )))

        )) ||
        isReportDistributionConditionValid(state.legalAgremnt === "Yes" && isVIPInfoRequired()) ||
        isReportDistributionConditionValid(state.legalAgremnt === "Yes" && isSensitiveInfoRequired(state.senscondtextInfo)) ||
        isReportDistributionConditionValid(state.legalAgremnt === "Yes" && isPHIInfoRequired()) ||
        (state.repDist === "Internal Use Only" && isVIPInfoRequired()) ||
        (state.repDist === "Internal Use Only" && isSensitiveInfoRequired(state.senscondtextInfo)) ||
        (state.repDist === "External Use Only" && isVIPInfoRequired()) ||
        (state.repDist === "External Use Only" && isSensitiveInfoRequired(state.senscondtextInfo)) ||
        (state.repDist === "External Use Only" && isPHIInfoRequired()) ||
        isEmpty(state.outPutFormat) ||
        (state.outPutFormat.indexOf("Other") !== -1 && isEmpty(state.delOptionOthr)) ||
        (state.reqDepName !== "Sales" && state.RegulatoryCompliance === "0") ||
        (state.reqDepName === "Sales" && (state.empGrp === 0)) ||
        (state.reqDepName !== "Sales" && state.RegulatoryCompliance === "No" && (
          state.QualityHealthOutcome === "0" ||
          state.MedicalCostreduction === "0" ||
          state.MarketShare === "0" ||
          state.ProviderVitality === "0" ||
          state.MemberEngagement === "0"
        )) ||
        (isEmpty(state.expeditedReqDesc) &&
          state.reqDueDate !== null && state.reqDueDate <= state.minDueDate)
      ) {
        console.error("ValidateFields function error")
        return false;
      } else {
        return true;
      }
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "ValidateFields", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  };
  const SetStateValue = (name: any, value: any) => {
    try {
      let newState: any = {};
      if (name == "reqDep" && value != 3) {
        newState = {
          ...state,
          [name]: value,
          "empGrp": 0,
          "RegulatoryCompliance": "0",
          "QualityHealthOutcome": "0",
          "MedicalCostreduction": "0",
          "MarketShare": "0",
          "ProviderVitality": "0",
          "MemberEngagement": "0",
        };
      }
      else if (name == "RegulatoryCompliance" && value !== "No") {
        newState = {
          ...state,
          [name]: value,

          "QualityHealthOutcome": "0",
          "MedicalCostreduction": "0",
          "MarketShare": "0",
          "ProviderVitality": "0",
          "MemberEngagement": "0",
        };
      }
      else if (name == "reportFrqncy" && value != 1) {
        newState = {
          ...state,
          [name]: value,
          "busRec": [],
          "autoSchRec": "Daily",
          "recurrenceDaily": "",
          "dailyEveryDayRecur": "",
          "weekRecurrence": "",
          "selectedWeekRecurrences": "",
          "recurrenceMonthly": "",
          "monthlyDayRecur": "",
          "monthlyMonthRecur": "",
          "monthlySelectedDay1": "",
          "monthlySelectedDay2": "",
          "monthOccurence": ""

        };

      }
      else if (name == "outPutFormat" && !value?.includes("Other")) {
        newState = {
          ...state,
          [name]: value,
          "delOptionOthr": ""
        };

      }
      else if (name == "autoSchRec") {
        newState = {
          ...state,
          [name]: value,
          "recurrenceDaily": "",
          "dailyEveryDayRecur": "",
          "weekRecurrence": "",
          "selectedWeekRecurrences": "",
          "recurrenceMonthly": "",
          "monthlyDayRecur": "",
          "monthlyMonthRecur": "",
          "monthlySelectedDay1": "",
          "monthlySelectedDay2": "",
          "monthOccurence": ""

        };
      }
      else if (name == "reqDueDate") {
        if (!(state.reqDueDate <= reqMinDate)) {
          newState = {
            ...state,
            [name]: value,
            "expeditedReqDesc": ""
          }

        }
        else {
          newState = {
            ...state,
            [name]: value,

          }
        }



      }
      else if (name == "repDist") {
        newState = {
          ...state,
          [name]: value,
          "legalAgremnt": "",
          shdVIPInfo: "",
          viptextInfo: "",
          shdPHIInfo: "",
          phiplltextInfo: "",
          shdSensitiveInfo: "",
          senscondtextInfo: "",
          appNeeded: "",
          selectAppr: [],
        }

      }
      else if (name == "shdVIPInfo") {
        newState = {
          ...state,
          [name]: value,
          viptextInfo: "",

        }

      }
      else if (name == "shdSensitiveInfo") {
        newState = {
          ...state,
          [name]: value,
          senscondtextInfo: "",

        }

      }
      else if (name == "legalAgremnt") {
        newState = {
          ...state,
          [name]: value,
          shdVIPInfo: "",
          shdSensitiveInfo: ""
        }

      }
      else {
        newState = { ...state, [name]: value };
      }
      let disablebtn = false;
      const isExternal = newState.repDist === "External Use Only";
      const legalAgreed = newState.legalAgremnt === "Yes";
      if (isExternal && name === "legalAgremnt" && value === "No") {
        disablebtn = true;
      } else if (name === "repDist" && value === "External Use Only" && !legalAgreed) {
        disablebtn = true;
      }

      setState({
        ...newState,
        disablebtn
      });
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "SetStateValue", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  };
  const UploadFiles = (fileItems: any) => {
    try {
      if (fileItems.length !== 0) {
        setFilesUpdated(true);
        const filePondFiles = fileItems.map((fileItem: any) => fileItem.source.name === undefined ? {
          source: fileItem.source,
          options: {
            type: "local",
            load: true,
            file: fileItem.file,
          },
        } : fileItem.file);
        setState((prevState) => ({
          ...prevState,
          attachments: filePondFiles,
        }));
      }
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "UploadFiles", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  };

  const GetChoiceValues = async () => {
    try {
      const fields = await web.lists
        .getByTitle("Requests")
        .fields
        .filter(`EntityPropertyName eq 'ConfidenceLevel' or EntityPropertyName eq 'LevelOfComplexity' or EntityPropertyName eq 'WorkingMonth'`)
        .get();

      const confidenceField = fields.find((f: any) => f.EntityPropertyName === "ConfidenceLevel");
      const complexityField = fields.find((f: any) => f.EntityPropertyName === "LevelOfComplexity");
      const monthField = fields.find((f: any) => f.EntityPropertyName === "WorkingMonth");

      setState(prevState => ({
        ...prevState,
        LevelOfComplexityChoices: complexityField?.Choices || [],
        ConfidenceLevelChoices: confidenceField?.Choices || [],
        YearMonthChoices: monthField?.Choices || [],
      }));
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "GetChoiceValues", error.status.toString(), LogLevel.Error, error.responseText);
      console.error("Error fetching choice fields:", error);
    }
  };

  const getConfigValues = async () => {
    try {
      const configItems = await web.lists.getByTitle(props?.props?.configList).items.get();
      let object = {
        AdminGrpId: 0, QMGrpId: 0,
        GovernanceGrpId: 0, IsApprovalNeeded: "Yes", DocSetContentTypeId: "", PHIGrpId: 0, SensitiveGrpId: 0,
        EnableReportDistributionCondition: "Yes", VipGrpId: 0,
        expediteddays: 0, EnableVIPRequired: "Yes", EnablePHIInfoRequired: "Yes", EnableSensitiveInfoRequired: "Yes"

      }
      configItems.forEach((item: any) => {
        switch (item.Title) {
          case 'Admin GroupId':
            object.AdminGrpId = item.Value
            break;
          case 'QM GroupId':
            object.QMGrpId = item.Value
            break;
          case 'Governance GroupId':
            object.GovernanceGrpId = item.Value
            break;
          case "EnableDepartmentApproval":
            object.IsApprovalNeeded = item.Value
            break;
          case "DocumentSet ContentType Id":
            object.DocSetContentTypeId = item.Value
            break;
          case 'PHIPII GroupId':
            object.PHIGrpId = item.Value
            break;
          case 'Sensitive GroupId':
            object.SensitiveGrpId = item.Value
            break;
          case 'EnableReportDistributionCondition':
            object.EnableReportDistributionCondition = item.Value
            break;
          case 'VIP GroupId':
            object.VipGrpId = item.Value
            break;

          case 'Expedited Request Business Days':
            object.expediteddays = item.Value
            break;
          case 'EnableVIPRequired':
            object.EnableVIPRequired = item.Value
            break;
          case 'EnablePHIInfoRequired':
            object.EnablePHIInfoRequired = item.Value
            break;
          case 'EnableSensitiveInfoRequired':
            object.EnableSensitiveInfoRequired = item.Value
            break;
          default:
            break;

        }
      });
      copyConfigpermission = object;
      setConfigPermission(object);
      getLoggedInUserDetails()
    } catch (error: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getConfigValues", "Exception", LogLevel.Error, error.message || JSON.stringify(error));
      console.log(error);
    }

  };

  const processAttachments = (reqNumber: any) => {
    const listName = "Project Documents";
    const listUrl = `${props?.props?.siteUrl}/${listName}`;
    if (pageMode === "edit") {
      const serverRelativeUrlTodocset = `${props?.props?.relativeUrl}/Project Documents/${state.reqNumber}`;
      reUploadFiles(props?.props?.siteUrl, serverRelativeUrlTodocset);
    } else {
      createDocumentSet(props?.props?.siteUrl, listName, reqNumber, () => {
        if (state.attachments.length == 0) {
          setState(prevState => ({
            ...prevState,
            hideDialog: false,
          }));
        } else {
          const serverRelativeUrlTodocset = `${props?.props?.relativeUrl}/Project Documents/${reqNumber}`;

          uploadDocumentToDocSet(props?.props?.siteUrl, serverRelativeUrlTodocset);
        }

      }, (error: any) => {
        console.log(JSON.stringify(error));
        setState(prevState => ({
          ...prevState,
          hideDialog: false,
        }));
      });
    }
  };
  const reUploadFiles = async (webUrl: any, serverRelativeUrlTodocset: any) => {
    const web = new Web(webUrl);
    const extraFilesInLib = state.attachedFiles.filter(attachedFile =>
      !state.attachments.some(formFile =>
        (formFile.options?.file.name || formFile.name) === attachedFile.options.file.name
      )
    );
    for (const file of extraFilesInLib) {
      const serverRelativeUrl = file.source;
      try {
        await web.getFileByServerRelativeUrl(serverRelativeUrl).recycle();
        console.log("File recycled successfully:", serverRelativeUrl);
      } catch (error) {
        util.writeErrorLog("RequestFormProfile.tsx", "reUploadFiles", error.status, LogLevel.Error, error.responseText);
        console.error("Error recycling file:", serverRelativeUrl, error);
      }
    }
    state.attachments.forEach(file => {
      if (!file.options) {
        uploadFilesToLib(file, webUrl, serverRelativeUrlTodocset);
      }
    });

    setState(prevState => ({
      ...prevState,
      hideDialog: false,
    }));
  };

  const uploadDocumentToDocSet = (webUrl: any, serverRelativeUrlTodocset: any) => {
    try {
      state.attachments.forEach(file => {
        uploadFilesToLib(file, webUrl, serverRelativeUrlTodocset);
      });
    }

    catch (error: any) {
      alert(error.responseText);
    }

  };


  const uploadFilesToLib = async (
    file: File,
    webUrl: string,
    serverRelativeUrlTodocset: string
  ) => {

    let fileCount = 0
    try {
      await web
        .getFolderByServerRelativeUrl(serverRelativeUrlTodocset)
        .files.add(file.name, file, true).then((uploadResult: any) => {
          fileCount = fileCount + 1
          console.log(uploadResult)
          if (state.attachments.length === fileCount) {
            setState((prevState) => ({
              ...prevState,
              hideDialog: false,
            }));
          }
        })


    }
    catch (error) {
      console.error("File upload error:", error);

    }
  };

  const createFolder = async (
    webUrl: any,
    listName: string,
    folderName: string,
    DocSetContentTypeId: any,
    success: any,
    error: any
  ) => {
    try {
      const result = await web.lists
        .getByTitle(listName)
        .rootFolder
        .folders
        .add(folderName);
      success(result);
    } catch (err) {
      console.error("Error creating folder:", err);
      error(err);
    }
  };

  const createDocumentSet = (webUrl: any, listName: any, folderName: any, success: any, error: any) => {
    createFolder(webUrl, listName, folderName, copyConfigpermission?.DocSetContentTypeId, success, error);
  };

  const bindformValues = (id: any) => {
    setState((prevState) => ({
      ...prevState,
      formMode: pageMode,
    }));
    getRequestValues(Number(id));
  };

  const getRequestValues = async (id: any) => {
    try {
      const web = new Web(props?.props?.siteUrl);

      const item = await web.lists.getByTitle("Requests").items.getById(id).select(
        "Id", "Title", "ComplianceAssetId", "Request_x0020_No", "RequestName",
        "Business_x0020_Receiver/EMail", "Business_x0020_Receiver/Id", "Business_x0020_Requestor/EMail", "Business_x0020_Requestor/Id", "DepartmentId",
        "Report_x0020_Name", "Request_x0020_Due_x0020_Date", "Report_x0020_Description",
        "Business_x0020_Need", "WorkingMonth", "LevelOfComplexity", "ConfidenceLevel",
        "Should_x0020_Endangered_x0020_Me", "Data_x0020_Classification", "IsVIPInfo",
        "IsPhiIAndPllnfo", "IsSensitiveCondition", "VIPTextInfo", "PhiPllTextInfo",
        "SensitiveConditionTextInfo", "Created", "Member_x0020_Level_x0020_Require",
        "Should_x0020_VIP_x003f__x003f_", "Report_x0020_Distribution",
        "External_x0020_Data_x0020_Consum", "Data_x0020_Consumer_x0020_Author",
        "Minimum_x0020_Necessary", "Approval_x0020_Needed_x003f_", "Report_x0020_LayoutId",
        "Deliver_x0020_Option", "Automated_x0020_Scheduled_x0020_", "Organization_x0020_Name",
        "Contact_x0020_Name", "Contact_x0020_Email", "EmployeeOther", "MemberEngagement",
        "ProviderVitality", "MarketShare", "MedicalCostreduction", "QualityHealthOutcome",
        "RegulatoryCompliance", "Dev_x0020_Explain", "Scheduled_x0020_Recurrence_x0020",
        "Expedited_x0020_Request_x0020_Ex", "Is_x0020_Existing_x0020_Report",
        "Existing_x0020_Additional_x0020_", "Should_x0020_VIP_x0020_Members",
        "Intended_x0020_Use", "Output_x0020_Format", "Tracking_x0020_Id",
        "Type_x0020_of_x0020_RequestId", "Employer_x0020_GroupId", "Contact_x0020_Phone",
        "Annual_x0020_Review_x0020_of_x00", "Output_x0020_Format_x0020_Other",
        "Cognos_x0020_Folder_x0020_Name", "Delivery_x0020_Option_x0020_Othe",
        "Report_x0020_FrequencyId", "Approver/Id", "Approver/EMail", "Assigned_x0020_To/EMail",
        "Author/Title", "Status", "As_x0020_the_x0020_requestor", "Comments",
        "Previous_x0020_Comments", "isGovernanceCompleted", "Queue_x0020_Manager_x0020_Status",
        "Is_x0020_QA_x0020_Required", "Is_x0020_VP_x0020_approved", "Business_x0020_Reason"
      ).expand(
        "Assigned_x0020_To", "Business_x0020_Receiver", "Business_x0020_Requestor",
        "Approver", "Author"
      ).get();
      if (item?.Business_x0020_Receiver?.Id != undefined) {
        item.Business_x0020_Receiver.id = item?.Business_x0020_Receiver?.Id
      }
      if (item?.Business_x0020_Requestor?.Id != undefined) {
        item.Business_x0020_Requestor.id = item?.Business_x0020_Requestor?.Id
      }

      if (item?.Approver?.Id != undefined) {
        item.Approver.id = item?.Approver.Id
      }

      setFormValues(item);
      getProjectDocuments(item?.Request_x0020_No);
      if (pageMode === "view") {
        document.querySelectorAll(".viewMode input, .viewMode select, .viewMode textarea").forEach((el: any) => {
          el.setAttribute("disabled", "true");
        });
        document.querySelectorAll(".errorMessage").forEach((el: any) => {
          el.style.display = "none";
        });
      }
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "getRequestValues", error.status || "Error", LogLevel.Error, error.message);
      console.error(error);
    }
  };

  const setFormValues = (data: any) => {
    try {
      const comments = data.Comments != null && data.Comments != "" ? data.Comments : "";
      const prevComments = comments + (data.Previous_x0020_Comments != null ? data.Previous_x0020_Comments : "");
      const scheduledData = JSON.parse(data.Scheduled_x0020_Recurrence_x0020);
      setState((prevState) => ({
        ...prevState,
        currentUser: data.Author.Title,
        reqDate: new Date(data.Created),
        reqNumber: data.Request_x0020_No,
        isExistingReport: data.Is_x0020_Existing_x0020_Report,
        existingAddComments: data.Existing_x0020_Additional_x0020_,
        busReq: [data.Business_x0020_Requestor],
        busRec: [data.Business_x0020_Receiver],
        reqDep: data.DepartmentId,
        reqName: data.RequestName,
        repName: data.Report_x0020_Name != null ? data.Report_x0020_Name : "",
        reqDueDate: new Date(data.Request_x0020_Due_x0020_Date),
        expeditedReqDesc: data.Expedited_x0020_Request_x0020_Ex != null ? data.Expedited_x0020_Request_x0020_Ex : "",
        repDescrip: data.Report_x0020_Description,
        busNeed: data.Business_x0020_Need,
        intendedUse: data.Intended_x0020_Use != null ? data.Intended_x0020_Use : "",
        repDist: data.Report_x0020_Distribution,
        shdVIPInfo: data.IsVIPInfo != null ? data.IsVIPInfo : "",
        shdPHIInfo: data.IsPhiIAndPllnfo != null ? data.IsPhiIAndPllnfo : "",
        shdSensitiveInfo: data.IsSensitiveCondition != null ? data.IsSensitiveCondition : "",
        phiplltextInfo: data.PhiPllTextInfo != null ? data.PhiPllTextInfo : "",
        viptextInfo: data.VIPTextInfo != null ? data.VIPTextInfo : "",
        senscondtextInfo: data.SensitiveConditionTextInfo != null ? data.SensitiveConditionTextInfo : "",
        legalAgremnt: data.External_x0020_Data_x0020_Consum != null ? data.External_x0020_Data_x0020_Consum : "",
        isTheMiniNecesry: data.Minimum_x0020_Necessary,
        appNeeded: data.Approval_x0020_Needed_x003f_ != null ? data.Approval_x0020_Needed_x003f_ : "",
        selectAppr: data.Approver?.Id != undefined ? [data.Approver] : [],
        outPutFormat: data.Output_x0020_Format != null ? data.Output_x0020_Format.join(",") : "",
        outputFormatText: data.Output_x0020_Format_x0020_Other != null ? data.Output_x0020_Format_x0020_Other : "",
        repLayout: data.Report_x0020_LayoutId,
        cognFoldrName: data.Cognos_x0020_Folder_x0020_Name != null ? data.Cognos_x0020_Folder_x0020_Name : "",
        delOptionOthr: data.Delivery_x0020_Option_x0020_Othe != null ? data.Delivery_x0020_Option_x0020_Othe : "",
        reportFrqncy: data.Report_x0020_FrequencyId,
        autoSchRec: data.Automated_x0020_Scheduled_x0020_,
        trackingId: data.Tracking_x0020_Id != null ? data.Tracking_x0020_Id : "",
        empGrp: data.Employer_x0020_GroupId,
        typeOfRequest: data.Type_x0020_of_x0020_RequestId,
        QualityHealthOutcome: data.QualityHealthOutcome ? data.QualityHealthOutcome : "0",
        MedicalCostreduction: data.MedicalCostreduction ? data.MedicalCostreduction : "0",
        ProviderVitality: data.ProviderVitality ? data.ProviderVitality : "0",
        RegulatoryCompliance: data.RegulatoryCompliance ? data.RegulatoryCompliance : "0",
        MemberEngagement: data.MemberEngagement ? data.MemberEngagement : "0",
        MarketShare: data.MarketShare ? data.MarketShare : "0",
        prevComment: prevComments,
        empgrpother: data.EmployeeOther,
        status: data.Status,
        qaRequestChanges: data.QA_x0020_Request_x0020_Changes,
        devExplain: data.Dev_x0020_Explain,
        LevelOfComplexity: data.LevelOfComplexity,
        ConfidenceLevel: data.ConfidenceLevel,
        WorkingMonth: data.WorkingMonth,
        recurrenceDaily: data.Automated_x0020_Scheduled_x0020_ == "Daily" && scheduledData?.Daily?.everyWeekDay == "Yes" ? "everyWeekDay" : "everyDay",
        dailyEveryDayRecur: data.Automated_x0020_Scheduled_x0020_ == "Daily" && scheduledData?.Daily?.dailyEveryDayRecur != undefined ? scheduledData?.Daily?.dailyEveryDayRecur : "",
        weekRecurrence: data.Automated_x0020_Scheduled_x0020_ == "Weekly" && scheduledData?.Weekly?.recurEvery != undefined ? scheduledData?.Weekly?.recurEvery : "",
        selectedWeekRecurrences: data.Automated_x0020_Scheduled_x0020_ == "Weekly" ? scheduledData?.Weekly?.weekDays : "",
        recurrenceMonthly: data?.Automated_x0020_Scheduled_x0020_ == "Monthly" && scheduledData?.Monthly?.everyDay == "Yes" ? "everyDay" : "selectedDay",
        monthlySelectedDay1: data?.Automated_x0020_Scheduled_x0020_ == "Monthly" && scheduledData?.Monthly?.monthlySelectedDay1 != undefined ? scheduledData?.Monthly?.monthlySelectedDay1 : "",
        monthlySelectedDay2: data?.Automated_x0020_Scheduled_x0020_ == "Monthly" && scheduledData?.Monthly?.monthlySelectedDay2 != undefined ? scheduledData?.Monthly?.monthlySelectedDay2 : "",
        monthOccurence: data?.Automated_x0020_Scheduled_x0020_ == "Monthly" && scheduledData?.Monthly?.everyMnth != undefined ? scheduledData?.Monthly?.everyMnth : "",
        monthlyMonthRecur: data?.Automated_x0020_Scheduled_x0020_ == "Monthly" && scheduledData?.Monthly?.everyDayMonthRecur != undefined ? scheduledData?.Monthly?.everyDayMonthRecur : "",
        monthlyDayRecur: data?.Automated_x0020_Scheduled_x0020_ == "Monthly" && scheduledData?.Monthly?.monthlyDayRecur != undefined ? scheduledData?.Monthly?.monthlyDayRecur : "",
      }));
    } catch (error) {
      util.writeErrorLog("RequestFormProfile.tsx", "setFormValues", error.status, LogLevel.Error, error.responseText);
      console.log(error)
    }
  };

  const getProjectDocuments = async (reqNumber: any) => {
    try {
      const folder = await web.getFolderByServerRelativeUrl(`Project Documents/${reqNumber}`).expand("Folders,Files").select("Name,ServerRelativeUrl,Files,Files/Name,Files/ServerRelativeUrl").get();

      const files = folder.Files;

      if (pageMode === "view") {
        setState((prevState) => ({
          ...prevState,
          attachedFiles: files,
        }));
      } else {
        const filePondFiles = files.map((file: any) => ({
          source: file.ServerRelativeUrl,
          options: {
            type: "local",
            load: true,
            file: {
              name: file.Name,
              size: "",
            },
          },
        }));
        setState((prevState) => ({
          ...prevState,
          attachments: filePondFiles,
          attachedFiles: filePondFiles,
        }));
      }
    } catch (error: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "getProjectDocuments", error.statusCode?.toString() ?? "500", LogLevel.Error, error.message);
      console.error(error);
    }
  };

  const createUpdateRequestItem = async () => {
    let inputData: any = createInputConditions();
    inputData = inputData != undefined && JSON.parse(inputData)
    const list = web.lists.getByTitle('Requests');

    try {
      if (itemId !== "") {
        await list.items.getById(Number(itemId)).update(inputData);

        util.writeErrorLog("RequestFormProfile.tsx", "createUpdateRequestItem", "Successfully updated the request", LogLevel.Error, "success");

        if (state.formMode === "edit") {
          await processAttachments(state.reqNumber);
        } else {
          setIsLoading(false);
        }

      } else {
        const addResult = await list.items.add(inputData);
        const { Id, Title } = addResult.data;

        const strUserTitle = Title.substring(Title.lastIndexOf("-") + 2).trim();
        const strRequestNumber = `${Id} - ${strUserTitle}`;

        setState((prevState) => ({
          ...prevState,
          reqNumber: strRequestNumber,
        }));
        await list.items.getById(Id).update({
          Request_x0020_No: strRequestNumber,
          Title: strRequestNumber,
        }).then(async (data: any) => {
          await processAttachments(strRequestNumber);
        }).catch((error: any) => {
          util.writeErrorLog("RequestFormProfile.tsx", "createUpdateRequestItem", "Successfully created the request", LogLevel.Error, "success");
          console.log(error, "update the request error")
        })

      }

    } catch (error: any) {
      util.writeErrorLog(
        "RequestForm.tsx",
        "createUpdateRequestItem",
        error.status || "",
        LogLevel.Error,
        error.message || JSON.stringify(error)
      );
      console.error(error);
    }
  };

  const createInputConditions = () => {
    try {
      let isVIPInfoGroup: any = "";
      let isPHIGroup: any = "";
      let isSensitiveGroup: any = "";
      if (state.checkuserdata.length > 0) {
        let checkuservalue = state.checkuserdata;
        console.log("checkuservalue: " + checkuservalue)

        isVIPInfoGroup = checkuservalue.filter(
          (x: any) => x == Number(copyConfigpermission.VipGrpId)
        );
        console.log("VipGrpId: " + Number(copyConfigpermission.VipGrpId))

        console.log("isVIPInfoGroup: " + isVIPInfoGroup)
        isPHIGroup = checkuservalue.filter(
          (x) => x == Number(copyConfigpermission.PHIGrpId)
        );
        isSensitiveGroup = checkuservalue.filter(
          (x) => x == Number(copyConfigpermission.SensitiveGrpId)
        );
      }
      var formStatus: string = "";
      let assignedTo;
      let vipmessageflag = "No";
      let phimessageflag = "No";
      let sensitivemessageflag = "No";
      if (state.appNeeded == "Yes") {
        formStatus = "Sent For Department Approval";
        assignedTo =
          state.selectAppr.length != 0 ? state.selectAppr[0].id : null;
      } else {
        if (copyConfigpermission.EnableReportDistributionCondition == "Yes") {
          if (state.repDist == "Internal Use Only") {
            let flagvip = false;
            let flagphi = false;
            if (
              (state.shdVIPInfo.length == 0 || state.shdVIPInfo == "No") &&
              (state.shdPHIInfo.length == 0 || state.shdPHIInfo == "No") &&
              (state.shdSensitiveInfo.length == 0 || state.shdSensitiveInfo == "No")
            ) {
              formStatus = "Sent to QM";
              assignedTo = copyConfigpermission.QMGrpId;
            } else {
              if (copyConfigpermission.EnableVIPRequired.toLowerCase() == "yes" && state.shdVIPInfo == "Yes") {
                flagvip = true;
                // business requestor check
                if (isVIPInfoGroup.length > 0) {
                  formStatus = "Sent to QM";
                  assignedTo = copyConfigpermission.QMGrpId;
                } else {
                  console.log("vipmessageflag 1");
                  vipmessageflag = "Yes";
                  formStatus = "Sent to QM";
                  assignedTo = copyConfigpermission.QMGrpId;
                }
              }
              if (copyConfigpermission.EnablePHIInfoRequired.toLowerCase() == "yes" && state.shdPHIInfo == "Yes") {
                if (isPHIGroup.length > 0) {
                  if (flagvip) {
                  } else {
                    formStatus = "Sent to QM";
                    assignedTo = copyConfigpermission.QMGrpId;
                  }
                } else {
                  phimessageflag = "Yes";
                  flagphi = true;
                  formStatus = "Sent to Manager PHI-PII";
                  assignedTo = state.brManager;
                }
              }
              if (copyConfigpermission.EnableSensitiveInfoRequired.toLowerCase() == "yes" && state.shdSensitiveInfo == "Yes") {
                if (isSensitiveGroup.length > 0) {
                  if (flagvip) {
                  } else if (flagphi) {
                  } else {
                    formStatus = "Sent to QM";
                    assignedTo = copyConfigpermission.QMGrpId;
                  }
                } else {
                  sensitivemessageflag = "Yes";
                  if (flagvip) {
                    if (!flagphi) {
                      formStatus = "Sent to Manager Sensitive";
                      assignedTo = state.brManager;
                    }
                  } else if (flagphi) {
                    formStatus = "Sent to Manager PHI-PII";
                    assignedTo = state.brManager;
                  } else {
                    formStatus = "Sent to Manager Sensitive";
                    assignedTo = state.brManager;
                  }
                }
              }
            }
          }
          else if (
            state.repDist == "Both Internal and External" ||
            state.repDist == "External Use Only"
          ) {
            if (state.legalAgremnt == "Yes") {
              let flagvip = false;
              let flagphi = false;
              if (
                (state.shdVIPInfo.length == 0 || state.shdVIPInfo == "No") &&
                (state.shdPHIInfo.length == 0 || state.shdPHIInfo == "No") &&
                (state.shdSensitiveInfo.length == 0 || state.shdSensitiveInfo == "No")
              ) {
                formStatus = "Sent to QM";
                assignedTo = copyConfigpermission.QMGrpId;
              }
              else if (
                state.shdVIPInfo == "Yes" &&
                state.shdPHIInfo == "Yes" &&
                state.shdSensitiveInfo == "Yes"
              ) {
                console.log("vipmessageflag 2");
                if (isVIPInfoGroup.length < 1) {
                  vipmessageflag = "Yes";
                }
                if (isPHIGroup.length < 1) {
                  phimessageflag = "Yes";
                }
                if (isSensitiveGroup.length < 1) {
                  sensitivemessageflag = "Yes";
                }
                formStatus = "Sent to Manager PHI-PII";
                assignedTo = state.brManager;
              }
              else {
                if (state.shdVIPInfo == "Yes") {
                  console.log("vipmessageflag 3");
                  flagvip = true;
                  if (isVIPInfoGroup.length < 1) {
                    vipmessageflag = "Yes";
                  }

                  formStatus = "Sent to QM";
                  assignedTo = copyConfigpermission.QMGrpId;
                }
                if (state.shdPHIInfo == "Yes") {
                  if (isPHIGroup.length < 1) {
                    phimessageflag = "Yes";
                  }

                  flagphi = true;
                  formStatus = "Sent to Manager PHI-PII";
                  assignedTo = state.brManager;
                }
                if (state.shdSensitiveInfo == "Yes") {
                  if (isSensitiveGroup.length < 1) {
                    sensitivemessageflag = "Yes";
                  }
                  if (flagvip) {
                    if (!flagphi) {
                      formStatus = "Sent to Manager Sensitive";
                      assignedTo = state.brManager;
                    }
                  } else if (flagphi) {
                    formStatus = "Sent to Manager PHI-PII";
                    assignedTo = state.brManager;
                  } else {
                    formStatus = "Sent to Manager Sensitive";
                    assignedTo = state.brManager;
                  }
                }
              }
            } else {
              if (state.repDist == "External Use Only") {
                formStatus = "Cancelled";
                assignedTo = null;
              } else {
                let flagvip = false;
                let flagphi = false;
                if (
                  state.shdVIPInfo == "No" &&
                  state.shdPHIInfo == "No" &&
                  state.shdSensitiveInfo == "No"
                ) {
                  formStatus = "Sent to QM";
                  assignedTo = copyConfigpermission.QMGrpId;
                } else {
                  if (state.shdVIPInfo == "Yes") {
                    flagvip = true;

                    if (isVIPInfoGroup.length > 0) {
                      formStatus = "Sent to QM";
                      assignedTo = copyConfigpermission.QMGrpId;
                    } else {
                      console.log("vipmessageflag 4");
                      formStatus = "Sent to QM";
                      vipmessageflag = "Yes";
                      assignedTo = copyConfigpermission.QMGrpId;
                    }
                  }
                  if (state.shdPHIInfo == "Yes") {

                    if (isPHIGroup.length > 0) {
                      if (flagvip) {
                      } else {
                        formStatus = "Sent to QM";
                        assignedTo = copyConfigpermission.QMGrpId;
                      }
                    } else {
                      phimessageflag = "Yes";
                      flagphi = true;
                      formStatus = "Sent to Manager PHI-PII";
                      assignedTo = state.brManager;
                    }
                  }
                  if (state.shdSensitiveInfo == "Yes") {
                    if (isSensitiveGroup.length > 0) {
                      if (flagvip) {
                      } else if (flagphi) {
                      } else {
                        formStatus = "Sent to QM";
                        assignedTo = copyConfigpermission.QMGrpId;
                      }
                    } else {
                      sensitivemessageflag = "Yes";
                      if (flagvip) {
                        if (!flagphi) {
                          formStatus = "Sent to Manager Sensitive";
                          assignedTo = state.brManager;
                        }
                      } else if (flagphi) {
                        formStatus = "Sent to Manager PHI-PII";
                        assignedTo = state.brManager;
                      } else {
                        formStatus = "Sent to Manager Sensitive";
                        assignedTo = state.brManager;
                      }
                    }
                  }
                }
              }
            }
          } else {
            formStatus = "Sent to QM";
            assignedTo = copyConfigpermission.QMGrpId;
          }
        } else {
          formStatus = "Sent to QM";
          assignedTo = copyConfigpermission.QMGrpId;
        }
      }
      let scheduleJson = null;
      let repdiststatus = "";
      let legalstatus = "";
      if (
        state.repDist == "Both Internal and External" &&
        state.legalAgremnt == "No"
      ) {
        setState((prevState) => ({
          ...prevState,
          repDist: "Internal Use Only",
        }));

        repdiststatus = "Internal Use Only";
        legalstatus = "";
      } else {
        repdiststatus = state.repDist;
        legalstatus = state.legalAgremnt;
      }

      if (state.autoSchRec == "Daily") {
        scheduleJson = {
          Daily: {
            everyWeekDay:
              state.recurrenceDaily == "everyWeekDay" ? "Yes" : "",
            day: state.recurrenceDaily == "everyDay" ? "Yes" : "",
            dailyEveryDayRecur: state.dailyEveryDayRecur,
          },
          Weekly: null,
          Monthly: null,
        };
      } else if (state.autoSchRec == "Weekly") {
        scheduleJson = {
          Daily: null,
          Weekly: {
            recurEvery: state.weekRecurrence,
            weekDays: state.selectedWeekRecurrences,
          },
          Monthly: null,
        };
      } else if (state.autoSchRec == "Monthly") {
        scheduleJson = {
          Daily: null,
          Weekly: null,
          Monthly: {
            everyDay: state.recurrenceMonthly == "everyDay" ? "Yes" : "",
            monthlyDayRecur:
              state.recurrenceMonthly == "everyDay"
                ? state.monthlyDayRecur
                : "",
            everyDayMonthRecur:
              state.recurrenceMonthly == "everyDay"
                ? state.monthlyMonthRecur
                : "",
            selectedDay:
              state.recurrenceMonthly == "selectedDay" ? "Yes" : "",
            monthlySelectedDay1:
              state.recurrenceMonthly == "selectedDay"
                ? state.monthlySelectedDay1
                : "",
            monthlySelectedDay2:
              state.recurrenceMonthly == "selectedDay"
                ? state.monthlySelectedDay2
                : "",
            everyMnth:
              state.recurrenceMonthly == "selectedDay"
                ? state.monthOccurence
                : "",
          },
        };
      }
      let status =
        state.appNeeded == "Yes" ? "Sent For Department Approval" : "";

      let initialprevcomment = "";

      console.log("formStatus: " + formStatus);
      if (formStatus == "Sent to QM") {
        initialprevcomment =
          "[" + moment(new Date()).format("MM/DD/YYYY HH:mm")
          +
          ": Sent to QM -" +
          props?.props?.userDisplayName +
          " ]";
      } else if (formStatus == "Sent to Manager PHI-PII") {
        initialprevcomment =
          "[" +
          moment(new Date()).format("MM/DD/YYYY HH:mm") +
          ": Sent to Manager PHI-PII -" +
          props?.props?.userDisplayName +
          " ]";
      } else {
        initialprevcomment =
          "[" +
          moment(new Date()).format("MM/DD/YYYY HH:mm") +
          ": Sent to Manager Sensitive -" +
          props?.props?.userDisplayName +
          " ]";
      }

      if (state.formMode == "edit") {
        formStatus = state.status;
      }

      let requestlistItem: string = "";

      if (state.formMode == "edit") {
        console.log("IN Edit Request");
        requestlistItem = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Title: state.reqNumber,
          Request_x0020_No: state.reqNumber,
          Is_x0020_Existing_x0020_Report: state.isExistingReport,
          Existing_x0020_Additional_x0020_: state.existingAddComments,
          Business_x0020_RequestorId:
            state.busReq.length != 0 ? state.busReq[0].id : null,
          Business_x0020_ReceiverId: state.busRec.length != 0 ? state.busRec[0].id : null,
          DepartmentId: Number(state.reqDep),
          DepartmentTextValue: state.reqDepName,
          RequestName: state.reqName,
          Report_x0020_Name: state.repName,
          Report_x0020_Description: state.repDescrip,
          Business_x0020_Need: state.busNeed,
          Request_x0020_Due_x0020_Date: state.reqDueDate,
          Expedited_x0020_Request_x0020_Ex: state.expeditedReqDesc,
          Report_x0020_Distribution: repdiststatus,
          IsVIPInfo: state.shdVIPInfo,
          IsPhiIAndPllnfo: state.shdPHIInfo,
          IsSensitiveCondition: state.shdSensitiveInfo,
          PhiPllTextInfo: state.phiplltextInfo,
          VIPTextInfo: state.viptextInfo,
          SensitiveConditionTextInfo: state.senscondtextInfo,
          External_x0020_Data_x0020_Consum: legalstatus,
          Minimum_x0020_Necessary: state.isTheMiniNecesry,
          Approval_x0020_Needed_x003f_: state.appNeeded,
          Report_x0020_LayoutId: Number(state.repLayout),
          Report_x0020_FrequencyId: Number(state.reportFrqncy),
          Automated_x0020_Scheduled_x0020_: state.autoSchRec,
          Output_x0020_Format: {
            __metadata: { type: "Collection(Edm.String)" },
            results: [state.outPutFormat],
          },
          Output_x0020_Format_x0020_Other: state.outputFormatText,
          ApproverId:
            state.selectAppr.length != 0 ? state.selectAppr[0].id : null,
          Status: formStatus,
          Tracking_x0020_Id: state.trackingId,
          Employer_x0020_GroupId: Number(state.empGrp),
          Type_x0020_of_x0020_RequestId: Number(state.typeOfRequest),
          Intended_x0020_Use: state.intendedUse,
          Scheduled_x0020_Recurrence_x0020: JSON.stringify(scheduleJson),
          Delivery_x0020_Option_x0020_Othe:
            state.outPutFormat.indexOf("Other") != -1
              ? state.delOptionOthr
              : "",
          IsVIPMessageFlag: vipmessageflag,
          IsPHIMessageFlag: phimessageflag,
          IsSensitiveFlag: sensitivemessageflag,
          EmployeeOther: state.empgrpother,
          Previous_x0020_Comments: initialprevcomment,
          QualityHealthOutcome: state.QualityHealthOutcome,
          MedicalCostreduction: state.MedicalCostreduction,
          ProviderVitality: state.ProviderVitality,
          RegulatoryCompliance: state.RegulatoryCompliance,
          MemberEngagement: state.MemberEngagement,
          WorkingMonth: state.WorkingMonth,
          MarketShare: state.MarketShare,
          LevelOfComplexity: state.LevelOfComplexity,
          ConfidenceLevel: state.ConfidenceLevel
        });
      }
      else {

        requestlistItem = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Title: state.reqNumber,
          Request_x0020_No: state.reqNumber,
          Is_x0020_Existing_x0020_Report: state.isExistingReport,
          Existing_x0020_Additional_x0020_: state.existingAddComments,
          Business_x0020_RequestorId:
            state.busReq.length != 0 ? state.busReq[0].id : null,
          Business_x0020_ReceiverId: state.busRec.length != 0 ? state.busRec[0].id : null,
          DepartmentId: Number(state.reqDep),
          DepartmentTextValue: state.reqDepName,
          RequestName: state.reqName,
          Report_x0020_Name: state.repName,
          Report_x0020_Description: state.repDescrip,
          Business_x0020_Need: state.busNeed,
          Request_x0020_Due_x0020_Date: state.reqDueDate,
          Expedited_x0020_Request_x0020_Ex: state.expeditedReqDesc,
          Report_x0020_Distribution: repdiststatus,
          IsVIPInfo: state.shdVIPInfo,
          IsPhiIAndPllnfo: state.shdPHIInfo,
          IsSensitiveCondition: state.shdSensitiveInfo,
          PhiPllTextInfo: state.phiplltextInfo,
          VIPTextInfo: state.viptextInfo,
          SensitiveConditionTextInfo: state.senscondtextInfo,
          External_x0020_Data_x0020_Consum: legalstatus,
          Minimum_x0020_Necessary: state.isTheMiniNecesry,
          Approval_x0020_Needed_x003f_: state.appNeeded,
          Report_x0020_LayoutId: Number(state.repLayout),
          Report_x0020_FrequencyId: Number(state.reportFrqncy),
          Automated_x0020_Scheduled_x0020_: state.autoSchRec,
          Output_x0020_Format: {
            __metadata: { type: "Collection(Edm.String)" },
            results: [state.outPutFormat],
          },
          Output_x0020_Format_x0020_Other: state.outputFormatText,
          ApproverId:
            state.selectAppr.length != 0 ? state.selectAppr[0].id : null,
          Status: formStatus,
          Assigned_x0020_ToId: assignedTo,
          Tracking_x0020_Id: state.trackingId,
          Employer_x0020_GroupId: Number(state.empGrp),
          Type_x0020_of_x0020_RequestId: Number(state.typeOfRequest),
          Intended_x0020_Use: state.intendedUse,
          Scheduled_x0020_Recurrence_x0020: JSON.stringify(scheduleJson),
          Delivery_x0020_Option_x0020_Othe:
            state.outPutFormat.indexOf("Other") != -1
              ? state.delOptionOthr
              : "",
          IsVIPMessageFlag: vipmessageflag,
          IsPHIMessageFlag: phimessageflag,
          IsSensitiveFlag: sensitivemessageflag,
          EmployeeOther: state.empgrpother,
          Previous_x0020_Comments: initialprevcomment,
          QualityHealthOutcome: state.QualityHealthOutcome,
          MedicalCostreduction: state.MedicalCostreduction,
          ProviderVitality: state.ProviderVitality,
          RegulatoryCompliance: state.RegulatoryCompliance,
          MemberEngagement: state.MemberEngagement,
          WorkingMonth: state.WorkingMonth,
          MarketShare: state.MarketShare,
          LevelOfComplexity: state.LevelOfComplexity,
          ConfidenceLevel: state.ConfidenceLevel
        });
      }
      return requestlistItem;
    } catch (error: any) {
      util.writeErrorLog("RequestFormProfile.tsx", "createInputConditions", error.status, LogLevel.Error, error.responseText);
      console.error(error);
    }
  }
  useEffect(() => {
    if (pageMode === "view") {
      document.querySelectorAll(".viewMode input, .viewMode select, .viewMode textarea").forEach((el) => {
        el.setAttribute("disabled", "true");
      });
      document.querySelectorAll(".errorMessage").forEach((el: any) => {
        el.style.display = "none";
      });
    }
  }, [pageMode]);
  const handleButtonActions = (action: any) => {
    if (action === "Ok") {

      _closeDialog()
    }

  };
  return (
    <>
      <span className="ms-font-xl ms-fontColor-white" ref={_topElement}></span>
      {isLoading && <PageLoader />}
      {pageMode !== "view" && configpermission != undefined && state?.currentUser != "" && (
        <div className="mb-5">
          <form className={isLoading ? "formOpacity" : ""}>
            <InformationStep
              values={state}
              setState={setState}
              webPartProps={props?.props}
              setFieldValues={SetStateValue}
              configpermission={configpermission}

              currentStep={state.currentStep}
            ></InformationStep>
            <DetailedDescStep
              values={state}
              webPartProps={props?.props}

              UploadFiles={UploadFiles}
              setFieldValues={SetStateValue}

              currentStep={state.currentStep}
            ></DetailedDescStep>
            <ExecDeliveryReq
              values={state}
              webPartProps={props?.props}

              setFieldValues={SetStateValue}

              currentStep={state.currentStep}
            ></ExecDeliveryReq>
          </form>
        </div>
      )}
      {pageMode === "view" && configpermission != undefined && state?.currentUser != "" && (
        <div className={isLoading ? "formOpacity viewMode mb-5" : "viewMode mb-5"}>
          <InformationStep
            values={state}
            webPartProps={props?.props}
            setFieldValues={SetStateValue}
            configpermission={configpermission}
            setState={setState}
            currentStep={state.currentStep}
          ></InformationStep>
          <DetailedDescStep
            values={state}
            webPartProps={props?.props}

            UploadFiles={UploadFiles}
            setFieldValues={SetStateValue}

            currentStep={state?.currentStep}
          ></DetailedDescStep>
          <ExecDeliveryReq
            values={state}
            webPartProps={props?.props}

            setFieldValues={SetStateValue}

            currentStep={state?.currentStep}
          ></ExecDeliveryReq>
        </div>
      )}
      {state?.reqNumber?.length > 2 && <div id="divBtns" className="bg-white fixed-bottom flexMiddle gap-1 justify-content-end p-2">
        <button className="btn btn-secondary" type="button" onClick={cancelForm}>
          Cancel
        </button>
        {state?.currentStep !== 1 && pageMode != "view" && (
          <button className="btn btn-primary float-right" type="button" onClick={_prev}>
            Previous
          </button>
        )}
        {state.disablebtn ? (
          <button className="btn btn-primary btnSubmit float-right me-5" type="button" disabled>
            Submit
          </button>
        ) : (
          <button className="btn btn-primary me-5" type="button" onClick={_next}
            disabled={pageMode === "view" || state.disablebtn}>
            {state.currentStep < 3 ? "Submit" : "Submit"}
          </button>
        )}
      </div>}
      <div>
        {state.hideDialog == false && (
          <CustomModal
            title="Request Form"
            message={state.isValidError && pageMode === "new" ? "Request is submitted successfully" :
              state.isValidError && pageMode === "edit" ? "Request is edited successfully" : !state.isValidError ?
                "Required fields are missing. All fields with (*) must be populated." : ""
            }

            buttonOneText="Ok"

            onButtonOneClick={() => handleButtonActions("Ok")}

          />
        )}

      </div>
    </>
  );
};

export default RequestFormProfile;
