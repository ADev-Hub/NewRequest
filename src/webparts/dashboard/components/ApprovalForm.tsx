import * as React from 'react';
import { useState, useEffect } from 'react';
import { Web } from "sp-pnp-js";
import { LogLevel } from '@pnp/logging';
import * as util from '../../../Util';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Loader, Placeholder } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'
import {
  DatePicker,
} from "office-ui-fabric-react";
import { IPeoplePickerContext, PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import CustomModal from '../../../GlobalComponent/CustomModal';
import { CustomToolTip } from '../../../GlobalComponent/customToolTip';
import * as moment from 'moment';
const departmentValue: any = {
  title: "",
  vpId: 0,
  iroId: 0,
  brmanager: 0,
};
let copyRequestData: any;

const ApprovalForm = (props: any) => {
  let TodayCopy = new Date()

  let today = moment(new Date()).format("MM/DD/YYYY HH:mm");
  const currUserTitle = props?.props?.context?.pageContext?.user?.displayName;
  let dummyFormData: any = {
    Id: null,
    comments: "",
    isDevCompleted: "No",
    prevComments: "",
    isGovernanceCompleted: "Yes",
    qMStatus: "",
    devResource: [],
    pendToResource: [],
    qaResource: [],
    isQARequired: "Yes",
    vpApproved: "Yes",
    status: "",
    devStatus: "",
    returnToQM: "No",
    assignedTo: null,
    businessRequester: null,
    qaApproveRequest: "",
    uatApproveRequest: "Yes",
    overallSatisfaction: "",
    metExpectations: "",
    reqCompletedTimely: "",
    surveyComments: "",
    reqNumber: "",
    devActualHrs: "",
    devEstimatedHrs: "",
    devPercentComplete: "",
    devDueDate: null,
    reqDueDate: null,
    devExpectedDueDate: new Date(),
    devDatedNotes: "",
    devAreRequestChanges: "No",
    devExplain: "",
    devFollowUp: "",
    devReqExplanation: "",
    qaActualHrs: "",
    qaEstimatedHrs: "",
    qaHours: "",
    qaIssues: "",
    qaExpectedDueDate: new Date(),
    qaDueDate: null,
    qaDatedNotes: "",
    qaRequestChanges: "",
    qaReqNotTimely: "",
    qaFollowUp: "",
    qaPercentComplete: "",
    qaReturnToQM: "No",
    qaReassign: "No",
    IsSensitiveCondition: "",
    PhiPllTextInfo: "",
    SensitiveConditionTextInfo: "",
    IsVIPMessageFlag: "No",
    shdVIPInfo: "",
    IsPHIMessageFlag: "No",
    IsSensitiveFlag: "No",
    vpid: 0,
    iroid: 0,
    reqmanager: 0,
    ShowPHIMessage: "No",
    ShowSensitiveMessage: "No",
    VIPMessage: "",
    HasVIPAccessMessage: "",
    PHIPIIMessage: "",
    SensitiveMessage: "",
    isQAChanged: false,
    qaResourceId: null,
    NegotiatedDueDate: null,
    QualityHealthOutcome: "0",
    MedicalCostreduction: "0",
    ProviderVitality: "0",
    RegulatoryCompliance: "0",
    MemberEngagement: "0",
    MarketShare: "0",
    IsQARequestChanges: "No",
    LevelOfComplexity: "0",
    ConfidenceLevel: "0",
    LevelOfComplexityChoices: [],
    ConfidenceLevelChoices: [],
    ReportType: "0",
    WorkingMonth: "0",
    ReportTypeChoices: [],
    YearMonthChoices: [],
    DepartmentTitle: ""
  }
  const web = new Web(props?.props?.siteUrl);
  const [approvalFormStateValues, setApprovalFormStateValues] = useState(dummyFormData);


  const [managerid, setManagerid]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading)
  useEffect(() => {
    getRequestValues(props?.approvalData?.Id);
    props.props.context.absoluteUrl = props?.props?.context.pageContext.web.absoluteUrl
  }, []);

  const getRequestValues = async (id: number) => {

    try {
      const item = await web.lists.getByTitle('Requests').items.getById(id).select(
        'Id', 'Title', 'Request_x0020_No', 'Comments', 'Previous_x0020_Comments', 'Is_x0020_Dev_x0020_Completed', 'isGovernanceCompleted', 'Queue_x0020_Manager_x0020_Status',
        'Developer_x0020_Resource/EMail', 'Developer_x0020_Resource/Id', 'Is_x0020_QA_x0020_Required', 'Is_x0020_VP_x0020_approved', 'Status', 'Developer_x0020_Status', 'Return_x0020_to_x0020_QM', 'Assigned_x0020_To/Id', 'Assigned_x0020_To/EMail', 'Business_x0020_RequestorId', 'Qa_x0020_Approved_x0020_Request', 'UAT_x0020_Approved_x0020_Request',
        'Developer_x0020_ResourceId', 'QA_x0020_ResourceId', 'QA_x0020_Resource/EMail', 'QA_x0020_Resource/Id', 'NegotiatedDueDate',
        'MemberEngagement', 'WorkingMonth', 'ProviderVitality', 'MarketShare', 'MedicalCostreduction', 'QualityHealthOutcome', 'RegulatoryCompliance', 'ReportType',
        'Dev_x0020_any_x0020_request_x002', 'isQARequestChanges', 'LevelOfComplexity', 'ConfidenceLevel',
        'QAReAssign', 'DepartmentId', 'IsSensitiveCondition', 'PhiPllTextInfo', 'SensitiveConditionTextInfo', 'IsVIPInfo', 'IsVIPMessageFlag', 'IsPHIMessageFlag', 'IsSensitiveFlag', 'ShowSensitiveMessage', 'ShowPHIMessage', 'QA_x0020_Return_x0020_to_x0020_Q', 'Dev_x0020_Actual_x0020_Hours', 'Dev_x0020_Estimated_x0020_Hours', 'Dev_x0020_Percent_x0020_Complete', 'Request_x0020_Due_x0020_Date', 'Dev_x0020_Negotiated_x0020_Due_x', 'Dev_x0020_Expected_x0020_Due_x00',
        'Dev_x0020_Dated_x0020_Notes', 'Dev_x0020_any_x0020_request_x002', 'Dev_x0020_Explain', 'Dev_x0020_Follow_x002d_up', 'Dev_x0020_due_x0020_date_x0020_e',
        'QA_x0020_Hours_x0020__x0028_actu', 'QA_x0020_Estimated_x0020_hours', 'QA_x0020_hours', 'QA_x0020_Issues', 'QA_x0020_Expected_x0020_Due_x002',
        'QA_x0020_Negotiated_x0020_Due_x0', 'QA_x0020_Dated_x0020_Notes', 'QA_x0020_Request_x0020_Changes', 'QA_x0020_Reason_x0020_request_x0',
        'QA_x0020_Follow_x0020_Up', 'QA_x0020_Percent_x0020_Complete'
      ).expand('QA_x0020_Resource/Id', 'Developer_x0020_Resource/ID', 'Assigned_x0020_To').get();

      const department = await web.lists.getByTitle('Departments').items.filter(`Id eq '${item.DepartmentId}'`).get();

      const departmentValues = {
        title: department?.length > 0 ? department[0].Title : "",
        vpId: department?.length > 0 ? department[0].VPId : "",
        iroId: department?.length > 0 ? department[0].IROId : "",
      };

      const brid = item.Business_x0020_RequestorId;
      const businessRequester = await web.getUserById(brid).get();
      const manager = await web.ensureUser(businessRequester.LoginName).then(user => {
        return web.getUserById(user.data.Id).get();
      });

      const fields = await web.lists.getByTitle('Requests').fields.filter("EntityPropertyName eq 'LevelOfComplexity' or EntityPropertyName eq 'ConfidenceLevel' or EntityPropertyName eq 'ReportType' or EntityPropertyName eq 'WorkingMonth'").get();
      const LevelOfComplexityChoices = fields[0].Choices;
      const ConfidenceLevelChoices = fields[1].Choices;
      const ReportTypeChoices = fields[2].Choices;
      const YearMonthChoices = fields[3].Choices;

      setFormValues(item, departmentValues.vpId, departmentValues.iroId, manager.Id, LevelOfComplexityChoices, ConfidenceLevelChoices, ReportTypeChoices, YearMonthChoices, departmentValues.title);
    } catch (error) {
      util.writeErrorLog("ApprovalForm.tsx", "getRequestValues :  GetChoiceDropDown Values", error.status.toString(), LogLevel.Error, error.responseText);

      console.log("error on get data prepare")
    }
  };

  const setFormValues = (data: any, strvpid: number, striroid: number, strreqid: number, LevelOfComplexityChoices: any[], ConfidenceLevelChoices: string[], ReportTypeChoices: string[], YearMonthChoices: string[], deptTitle: string) => {
    const devRes = data.Developer_x0020_Resource && data.Developer_x0020_Resource.EMail ? [data.Developer_x0020_Resource] : [];
    const qaRes = data.QA_x0020_Resource && data.QA_x0020_Resource.EMail ? [data.QA_x0020_Resource] : [];

    let comments = data.Comments || "";
    const prevComments = comments + (data.Previous_x0020_Comments || "");
    comments = ""

    data.qaResource = qaRes;
    copyRequestData = data
    setApprovalFormStateValues((prevState: any) => ({
      ...prevState,
      Id: props?.approvalData?.Id,
      comments: comments,
      isDevCompleted: data.Is_x0020_Dev_x0020_Completed || "No",
      prevComments: prevComments,
      isGovernanceCompleted: data.isGovernanceCompleted || "Yes",
      qMStatus: data.Queue_x0020_Manager_x0020_Status || "",
      devResource: devRes,
      isQARequired: data.Is_x0020_QA_x0020_Required || "Yes",
      vpApproved: data.Is_x0020_VP_x0020_approved || "Yes",
      status: data.Status,
      devStatus: data.Developer_x0020_Status || "Development",
      returnToQM: data.Return_x0020_to_x0020_QM != null ? "No" : "No",
      qaReturnToQM: data.QA_x0020_Return_x0020_to_x0020_Q != null ? "No" : "No",
      qaReassign: data.QAReAssign != null ? "No" : "No",
      assignedTo: data.Assigned_x0020_To?.Id,
      businessRequester: data.Business_x0020_RequestorId,
      qaApproveRequest:
        data.Qa_x0020_Approved_x0020_Request != null
          ? data.Qa_x0020_Approved_x0020_Request
          : "In Progress",
      uatApproveRequest:
        data.UAT_x0020_Approved_x0020_Request != null
          ? data.UAT_x0020_Approved_x0020_Request
          : "Yes",
      qaResource: qaRes,
      overallSatisfaction: "",
      metExpectations: "",
      reqCompletedTimely: "",
      surveyComments: "",
      reqNumber: data.Request_x0020_No,
      devActualHrs: data.Dev_x0020_Actual_x0020_Hours,
      devEstimatedHrs: data.Dev_x0020_Estimated_x0020_Hours,
      devPercentComplete: data.Dev_x0020_Percent_x0020_Complete,
      devDueDate: data.Dev_x0020_Negotiated_x0020_Due_x ? new Date(data.Dev_x0020_Negotiated_x0020_Due_x) : null,
      reqDueDate: new Date(data.Request_x0020_Due_x0020_Date),
      devExpectedDueDate: data.Dev_x0020_Expected_x0020_Due_x00 ? new Date(data.Dev_x0020_Expected_x0020_Due_x00) : new Date(),
      devDatedNotes: data.Dev_x0020_Dated_x0020_Notes,
      devAreRequestChanges: data.Dev_x0020_any_x0020_request_x002,
      devExplain: data.Dev_x0020_Explain,
      devFollowUp: data.Dev_x0020_Follow_x002d_up,
      devReqExplanation: data.Dev_x0020_due_x0020_date_x0020_e,
      qaActualHrs: data.QA_x0020_Hours_x0020__x0028_actu,
      qaEstimatedHrs: data.QA_x0020_Estimated_x0020_hours,
      qaHours: data.QA_x0020_hours,
      qaIssues: data.QA_x0020_Issues,
      qaExpectedDueDate: data.QA_x0020_Expected_x0020_Due_x002 ? new Date(data.QA_x0020_Expected_x0020_Due_x002) : new Date(),
      qaDueDate: data.QA_x0020_Negotiated_x0020_Due_x0 ? new Date(data.QA_x0020_Negotiated_x0020_Due_x0) : null,
      qaDatedNotes: data.QA_x0020_Dated_x0020_Notes,
      qaRequestChanges: data.QA_x0020_Request_x0020_Changes,
      qaReqNotTimely: data.QA_x0020_Reason_x0020_request_x0,
      qaFollowUp: data.QA_x0020_Follow_x0020_Up,
      qaPercentComplete: data.QA_x0020_Percent_x0020_Complete,
      pendToResource:
        (data?.Status == "Sent to QM" ||
          data?.Status == "Sent to QM - Hold" ||
          data?.Status == "Pend to") &&
          (data.Queue_x0020_Manager_x0020_Status == "Pending") ? [data?.Assigned_x0020_To] : null,
      IsSensitiveCondition: data.IsSensitiveCondition,
      PhiPllTextInfo: data.PhiPllTextInfo,
      SensitiveConditionTextInfo: data.SensitiveConditionTextInfo,
      IsVIPMessageFlag: data.IsVIPMessageFlag,
      IsPHIMessageFlag: data.IsPHIMessageFlag,
      IsSensitiveFlag: data.IsSensitiveFlag,
      shdVIPInfo: data.IsVIPInfo || "",
      vpid: strvpid,
      iroid: striroid,
      reqmanager: strreqid,
      ShowPHIMessage: data.ShowPHIMessage,
      ShowSensitiveMessage: data.ShowSensitiveMessage,
      VIPMessage: props?.configpermission?.VIPMessage,
      HasVIPAccessMessage: props?.configpermission?.HasVIPAccessMessage,
      PHIPIIMessage: props?.configpermission?.PHIPIIMessage,
      SensitiveMessage: props?.configpermission?.SensitiveMessages,
      isQAChanged: false,
      qaResourceId: null,
      NegotiatedDueDate: new Date(data.NegotiatedDueDate),
      QualityHealthOutcome: data.QualityHealthOutcome || "0",
      MedicalCostreduction: data.MedicalCostreduction || "0",
      ProviderVitality: data.ProviderVitality || "0",
      RegulatoryCompliance: data.RegulatoryCompliance || "0",
      MemberEngagement: data.MemberEngagement || "0",
      WorkingMonth: data.WorkingMonth || "0",
      MarketShare: data.MarketShare || "0",
      IsQARequestChanges: data.isQARequestChanges,
      LevelOfComplexity: data.LevelOfComplexity || "0",
      ConfidenceLevel: data.ConfidenceLevel || "0",
      LevelOfComplexityChoices: LevelOfComplexityChoices,
      ConfidenceLevelChoices: ConfidenceLevelChoices,
      ReportTypeChoices: ReportTypeChoices,
      YearMonthChoices: YearMonthChoices,
      ReportType: data.ReportType || "0",
      DepartmentTitle: deptTitle
    }));
  };

  const setFieldValues = (fldName: any, value: any) => {
    setApprovalFormStateValues((prevState: any) => ({
      ...prevState,
      [fldName]: value
    }));
  };

  const handlePeoplePickerChange = (stateName: string, items: any[]) => {
    setFieldValues(stateName, items);
    if (approvalFormStateValues.qMStatus == "Development") {
      if (stateName == "devResource") {
        let managerid: any = GetManager(items[0].loginName);
        setManagerid(managerid)
      }
    }
  };

  const showLib = () => {
    const documentSetUrl = `${props?.props?.siteUrl}/${props?.props?.documentSetLibTitle}`;
    window.open(
      `${documentSetUrl}/Forms/AllItems.aspx?id=${documentSetUrl}/${props?.approvalData?.Request_x0020_No}`,
      "_blank"
    );
  };

  const showQALib = () => {
    window.open(props?.configpermission?.QAChecklist, "_blank");
  };

  const closeForm = () => {
    props?.setOpenApprovalPopup(false)
    if (window.location.search.substring(1).length > 0) {
      window.location.href = window.location.href.substring(0, window.location.href.indexOf("?"));
    } else {
      props?.setState((prevState: any) => ({
        ...prevState,
        hideDialog: true,
        formSubmitted: false,

      }));

    }
  };

  const approveForm = async () => {
    props?.setOpenApprovalPopup(false)
    props?.setState((prevState: any) => ({
      ...prevState,
      hideDialog: true,
      btnClick: "Submit",
    }));

    setIsLoading(true);
    const inputData: any = createInputConditions();

    try {
      await web.lists.getByTitle('Requests').items.getById(props?.approvalData.Id).update(inputData);
      props?.setState((prevState: any) => ({
        ...prevState,
        formSubmitted: true,
        btnClick: "Submit",

      }));
      props.reloadData();
      setIsLoading(false);
    } catch (error) {
      util.writeErrorLog("ApprovalForm.tsx", "approveForm", error.status.toString(), LogLevel.Error, error.responseText);
    }
  };

  const rejectForm = async () => {
    props?.setOpenApprovalPopup(false)
    props?.setState((prevState: any) => ({
      ...prevState,
      hideDialog: true,
      btnClick: "Submit",

    }));
    setIsLoading(true);
    const inputData: any = createRejectInputConditions();

    try {
      await web.lists.getByTitle('Requests').items.getById(props?.approvalData.Id).update(inputData);
      props.reloadData();
      setIsLoading(false);
      props?.setState((prevState: any) => ({
        ...prevState,
        formSubmitted: true,
        btnClick: "Submit",
      }));
    } catch (error) {
      util.writeErrorLog("ApprovalForm.tsx", "rejectForm", error.status.toString(), LogLevel.Error, error.responseText);
    }
  };

  const submitForm = async () => {

    props?.setState((prevState: any) => ({
      ...prevState,

      btnClick: "Submit",
    }));
    if (ValidateFields()) {
      props?.setOpenApprovalPopup(false)
      props?.setState((prevState: any) => ({
        ...prevState,
        hideDialog: true,
      }));

      setIsLoading(true);
      const inputData: any = await createInputConditions();
      const updateData = JSON.parse(inputData)
      if (managerid != undefined && managerid != null) {
        updateData.DevelopmentManagerId = managerid
      }

      try {
        await web.lists.getByTitle('Requests').items.getById(props?.approvalData.Id).update(updateData);
        if (approvalFormStateValues.status === "Sent to UAT" && approvalFormStateValues.uatApproveRequest === "Yes") {
          await AddSurvey();
        }

        props?.reloadData();
        setIsLoading(false);
        props?.setState((prevState: any) => ({
          ...prevState,
          formSubmitted: true,
          btnClick: "Submit",
        }));
      } catch (error) {
        util.writeErrorLog("ApprovalForm.tsx", "submitForm", error.status.toString(), LogLevel.Error, error.responseText);
      }
    } else {
      props?.setState((prevState: any) => ({
        ...prevState,

        hideDialog: false,

      }));
    }
  };

  const AddSurvey = async () => {
    try {
      await web.lists.getByTitle(props.props?.surveyListTitle).items.add({
        Overall_x0020_satisfaction_x0020: approvalFormStateValues.overallSatisfaction,
        Did_x0020_the_x0020_results_x002: approvalFormStateValues.metExpectations,
        Was_x0020_your_x0020_request_x00: approvalFormStateValues.reqCompletedTimely,
        Please_x0020_provide_x0020_any_x: approvalFormStateValues.surveyComments,
        Request_x0020_Number: approvalFormStateValues.reqNumber
      });
    } catch (error) {
      util.writeErrorLog("ApprovalForm.tsx", "AddSurvey", error.status.toString(), LogLevel.Error, error.responseText);
    }
  };

  const ValidateFields = () => {
    let isValid = true;

    if (
      approvalFormStateValues.status === "Sent to QM" ||
      approvalFormStateValues.status === "Sent to QM - Hold" ||
      approvalFormStateValues.status === "Pend to" ||
      ((approvalFormStateValues.status === "Sent to Developer - Development" ||
        approvalFormStateValues.status === "Sent to Developer") && approvalFormStateValues.returnToQM === "No") ||
      (approvalFormStateValues.status === "Sent to QA" && approvalFormStateValues.qaReturnToQM === "No")
    ) {
      console.log("ReportType " + approvalFormStateValues.ReportType);
      if (approvalFormStateValues.qMStatus === "Pending" && !approvalFormStateValues.pendToResource) {
        isValid = false;
      }
      if (approvalFormStateValues.qMStatus === "") {
        isValid = false;
      } else if (
        approvalFormStateValues.status === "Sent to QM" ||
        approvalFormStateValues.status === "Sent to QM - Hold" ||
        approvalFormStateValues.status === "Pend to"
      ) {
        if (
          (approvalFormStateValues.DepartmentTitle !== "Sales" && approvalFormStateValues.RegulatoryCompliance === "0") ||
          (approvalFormStateValues.DepartmentTitle !== "Sales" &&
            approvalFormStateValues.RegulatoryCompliance === "No" &&
            (approvalFormStateValues.QualityHealthOutcome === "0" ||
              approvalFormStateValues.MedicalCostreduction === "0" ||
              approvalFormStateValues.MarketShare === "0" ||
              approvalFormStateValues.ProviderVitality === "0" ||
              approvalFormStateValues.MemberEngagement === "0"))
        ) {
          isValid = false;
        } else if (
          approvalFormStateValues.qMStatus === "Development" &&
          (approvalFormStateValues.ReportType === "0" || approvalFormStateValues.ReportType === "Select")
        ) {
          isValid = false;
        }
      }

      if (
        approvalFormStateValues.qMStatus === "Development" &&
        (approvalFormStateValues.devResource.length === 0 ||
          (approvalFormStateValues.isQARequired === "Yes" && approvalFormStateValues.qaResource.length === 0))
      ) {
        isValid = false;
      } else if (
        approvalFormStateValues.qMStatus === "Pending" &&
        (approvalFormStateValues.pendToResource === undefined ||
          (approvalFormStateValues.pendToResource !== undefined && approvalFormStateValues.pendToResource.length === 0))
      ) {
        return false;
      }
    } else if (approvalFormStateValues.qaReturnToQM === "Yes" || approvalFormStateValues.returnToQM === "Yes") {
      isValid = true;
    } else {
      isValid = true;
    }
    return isValid;
  };

  const createInputConditions = async () => {
    const { dashBoardState, configpermission } = props;
    let status = "";
    let assignedTo;
    const formattedDate = moment(new Date()).format("MM/DD/YYYY HH:mm");


    const prevComment = approvalFormStateValues.prevComments || "";
    console.log(prevComment);
    // Condition 1: Sent For Department Approval
    if (approvalFormStateValues.status === "Sent For Department Approval") {
      const comments = approvalFormStateValues.comments || "";
      if (approvalFormStateValues.vpApproved === "Yes") {
        if (dashBoardState.legalAgreement === "Yes") {
          status = "Governance Hold";
          assignedTo = configpermission.GovernanceGrpId;
        } else {
          status = "Sent to QM";
          assignedTo = configpermission.QMGrpId;
        }
      } else {
        assignedTo = null;
        status = "Cancelled";
      }
      return JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Comments: comments
          ? `[${formattedDate}: Comments by Department - ${currUserTitle}]: [Sent For Department Approval]: ${comments}<br/>`
          : "",
        Previous_x0020_Comments: "",
        Status: status,
        Assigned_x0020_ToId: assignedTo,
        Is_x0020_VP_x0020_approved: approvalFormStateValues.vpApproved,
      });
    }

    // Condition 2: Governance Hold
    else if (approvalFormStateValues.status === "Governance Hold") {
      const comments =
        approvalFormStateValues.comments && approvalFormStateValues.comments !== ""
          ? `[${formattedDate}: Comments by Governance Hold - ${currUserTitle}]: ${approvalFormStateValues.comments}<br/>`
          : "";

      if (approvalFormStateValues.isGovernanceCompleted === "Yes") {
        assignedTo = configpermission.QMGrpId;
        status = "Sent to QM";
      } else {
        assignedTo = null;
        status = "Cancelled";
      }
      return JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
        Comments: comments,
        Status: status,
        isGovernanceCompleted: approvalFormStateValues.isGovernanceCompleted,
        Assigned_x0020_ToId: assignedTo,
      });
    }

    // Condition 3: Sent to Manager PHI-PII
    else if (approvalFormStateValues.status === "Sent to Manager PHI-PII") {
      if (approvalFormStateValues.IsSensitiveFlag === "Yes") {
        assignedTo = approvalFormStateValues.reqmanager;
        status = "Sent to Manager Sensitive";
      } else {
        assignedTo = configpermission.QMGrpId;
        status = "Sent to QM";
      }

      const comments =
        approvalFormStateValues.comments && approvalFormStateValues.comments !== ""
          ? `[${formattedDate}: ${status}]<br/>[${formattedDate}: Comments by Manager PHI-PII - ${currUserTitle}] Approved - ${approvalFormStateValues.comments}<br/>`
          : `[${formattedDate}: ${status}]<br/>[${formattedDate}: Comments by Manager PHI-PII - ${currUserTitle}] - Approved<br/>`;

      return JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
        Comments: comments,
        Status: status,
        ShowPHIMessage: "No",
        Assigned_x0020_ToId: assignedTo,
      });
    }

    // Condition 3: Sent to Manager Sensitive
    else if (approvalFormStateValues.status === "Sent to Manager Sensitive") {
      let comments = "";

      if (approvalFormStateValues.IsSensitiveFlag === "Yes") {
        console.log("VP ID: " + departmentValue.vpId);
        assignedTo = approvalFormStateValues.vpid;
        status = "Sent to VP";
      } else {
        assignedTo = configpermission?.QMGrpId;
        status = "Sent to QM";
      }

      comments = approvalFormStateValues.comments
        ? `[${today}: ${status}]<br/>[${today}: Comments by Manager Sensitive - ${currUserTitle}] Approved - ${approvalFormStateValues.comments}<br/>`
        : `[${today}: ${status}]<br/>[${today}: Comments by Manager Sensitive - ${currUserTitle}] - Approved<br/>`;

      return JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
        Comments: comments,
        Status: status,
        ShowSensitiveMessage: "No",
        Assigned_x0020_ToId: assignedTo,
      });
    }
    // Condition 4: Sent to VP
    else if (approvalFormStateValues.status === "Sent to VP") {
      let assignedTo = 0;
      let status = "";
      const today = moment(new Date()).format("MM/DD/YYYY HH:mm");

      if (approvalFormStateValues.IsSensitiveFlag === "Yes") {
        console.log("IRO ID: " + departmentValue.iroId);
        assignedTo = approvalFormStateValues.iroid;
        status = "Sent to IRO";
      } else {
        assignedTo = configpermission.QMGrpId;
        status = "Sent to QM";
      }

      const comments = approvalFormStateValues.comments
        ? `[${today}: ${status}]<br/>[${today}: Comments by VP - ${currUserTitle}] Approved - ${approvalFormStateValues.comments}<br/>`
        : `[${today}: ${status}]<br/>[${today}: Comments by VP - ${currUserTitle}] - Approved<br/>`;

      const inputData = JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
        Comments: comments,
        Status: status,
        ShowSensitiveMessage: "No",
        Assigned_x0020_ToId: assignedTo,
      });
      return inputData;
    }
    // Condition 5: Sent to IRO
    else if (approvalFormStateValues.status === "Sent to IRO") {

      let assignedTo = configpermission.QMGrpId;
      let status = "Sent to QM";

      const comments = approvalFormStateValues.comments
        ? `[${today}: ${status} - Queue Manager]<br/>` +
        `[${today}: Comments by IRO - ${currUserTitle}] Approved - ${approvalFormStateValues.comments}<br/>`
        : `[${today}: ${status} - Queue Manager]<br/>` +
        `[${today}: Comments by IRO - ${currUserTitle}] - Approved<br/>`;

      const inputData = JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
        Comments: comments,
        Status: status,
        ShowSensitiveMessage: "No",
        Assigned_x0020_ToId: assignedTo,
      });

      return inputData;
    }
    else if (approvalFormStateValues.status === "Sent to QM" || approvalFormStateValues.status === "Sent to QM - Hold") {
      let statuscomment = approvalFormStateValues.status === "Sent to QM" ? "Sent to QM" : "Sent to QM - Hold";
      console.log(statuscomment);
      let comments = "";
      let inputData = "";
      let assignedTo = null;
      let status = "";

      if (approvalFormStateValues.qMStatus === "Development") {
        status = "Sent to Developer";
        assignedTo = getIdFromPeopleFiled(approvalFormStateValues.devResource);
        let qaResourceId = getIdFromPeopleFiled(approvalFormStateValues.qaResource);

        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] <br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: "Sent to Developer",
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Assigned_x0020_ToId: assignedTo,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          Developer_x0020_ResourceId: assignedTo,
          QA_x0020_ResourceId: qaResourceId,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
        return inputData;
      } else if (approvalFormStateValues.qMStatus === "Pending") {
        status = "Pend to";
        assignedTo = approvalFormStateValues.pendToResource.length > 0 ? approvalFormStateValues.pendToResource[0].id : null;

        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] <br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: status,
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Assigned_x0020_ToId: assignedTo,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
        return inputData;
      } else if (approvalFormStateValues.qMStatus === "Cancel") {
        status = "Cancelled";
        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] <br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: status,
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Assigned_x0020_ToId: null,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
        return inputData;
      } else {
        status = "Sent to QM - Hold";
        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by Queue Manager - ${currUserTitle}] <br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: status,
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
        return inputData;
      }
    }
    else if (approvalFormStateValues.status === "Pend to") {
      let inputData = "";
      let assignedTo = null;
      let comments = "";
      let status = "";

      if (approvalFormStateValues.qMStatus === "Development") {
        status = "Sent to Developer";
        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by ${currUserTitle} - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by ${currUserTitle} - ${currUserTitle}] <br/>`;

        assignedTo = getIdFromPeopleFiled(approvalFormStateValues.devResource);
        let qaResourceId = getIdFromPeopleFiled(approvalFormStateValues.qaResource);

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: "Sent to Developer",
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Assigned_x0020_ToId: assignedTo,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          Developer_x0020_ResourceId: assignedTo,
          QA_x0020_ResourceId: qaResourceId,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          ReportType: approvalFormStateValues.ReportType,
        });
      } else if (approvalFormStateValues.qMStatus === "Pending") {
        status = "Pend to";
        assignedTo =
          approvalFormStateValues.pendToResource.length > 0
            ? approvalFormStateValues.pendToResource[0].id
            : null;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: status,
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Assigned_x0020_ToId: assignedTo,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
      } else if (approvalFormStateValues.qMStatus === "Cancel") {
        status = "Cancelled";
        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by ${currUserTitle} - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by ${currUserTitle} - ${currUserTitle}] <br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: status,
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Assigned_x0020_ToId: null,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
      } else {
        status = "Sent to QM - Hold";
        comments = approvalFormStateValues.comments
          ? `[${today}: ${status}] <br/> [${today}: Comments by ${currUserTitle} - ${currUserTitle}] - ${approvalFormStateValues.comments} <br/>`
          : `[${today}: ${status}] <br/> [${today}: Comments by ${currUserTitle} - ${currUserTitle}] <br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Status: status,
          Queue_x0020_Manager_x0020_Status: approvalFormStateValues.qMStatus,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          QualityHealthOutcome: approvalFormStateValues.QualityHealthOutcome,
          RegulatoryCompliance: approvalFormStateValues.RegulatoryCompliance,
          MedicalCostreduction: approvalFormStateValues.MedicalCostreduction,
          ProviderVitality: approvalFormStateValues.ProviderVitality,
          MarketShare: approvalFormStateValues.MarketShare,
          MemberEngagement: approvalFormStateValues.MemberEngagement,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          LevelOfComplexity: approvalFormStateValues.LevelOfComplexity,
          ConfidenceLevel: approvalFormStateValues.ConfidenceLevel,
          Request_x0020_Due_x0020_Date: approvalFormStateValues.reqDueDate,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          ReportType: approvalFormStateValues.ReportType,
        });
      }

      return inputData;
    }
    else if (
      approvalFormStateValues.status === "Sent to Developer" ||
      approvalFormStateValues.status === "Sent to Developer - Design" ||
      approvalFormStateValues.status === "Sent to Developer - Development"
    ) {
      let assignedTo = null;
      let qaassignedTo = null;
      let isQaReturn = false;
      let completionDate = null;
      // let statuscomment = "Sent to Developer";
      let comments = "";
      // let prevComments = "";
      let datedNotes = "";

      if (
        approvalFormStateValues.devDatedNotes != null &&
        approvalFormStateValues.devDatedNotes !== ""
      ) {
        datedNotes = `${today}: ${approvalFormStateValues.devDatedNotes}; `;
      }

      if (approvalFormStateValues.returnToQM === "Yes") {
        status = "Sent to QM";
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}]<br/>`;
        isQaReturn = true;
        assignedTo = configpermission?.QMGrpId;
        qaassignedTo = null;
      } else if (approvalFormStateValues.devStatus === "Design") {
        status = "Sent to Developer";
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}]<br/>`;
        assignedTo = approvalFormStateValues.assignedTo;
      } else if (
        approvalFormStateValues.devStatus === "Development" &&
        approvalFormStateValues.isDevCompleted === "No"
      ) {
        status = "Sent to Developer";
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: Comments by Developer - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : "";
        let qaResourceId = getIdFromPeopleFiled(approvalFormStateValues.qaResource);
        qaassignedTo = qaResourceId;
        assignedTo = approvalFormStateValues.assignedTo;
      } else if (
        approvalFormStateValues.devStatus === "Development" &&
        approvalFormStateValues.isDevCompleted === "Yes" &&
        approvalFormStateValues.isQARequired === "Yes"
      ) {
        status = "Sent to QA";
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}]<br/>`;
        let qaResourceId = getIdFromPeopleFiled(approvalFormStateValues.qaResource);
        assignedTo = qaResourceId;
        qaassignedTo = qaResourceId;
      } else if (
        approvalFormStateValues.devStatus === "Development" &&
        approvalFormStateValues.isDevCompleted === "Yes" &&
        approvalFormStateValues.isQARequired === "No"
      ) {
        status = "Sent to UAT";
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by Developer - ${currUserTitle}]<br/>`;
        assignedTo = approvalFormStateValues.businessRequester;
        completionDate = new Date().toISOString();
      }

      let inputData;
      if (isQaReturn) {
        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Status: status,
          Return_x0020_to_x0020_QM: approvalFormStateValues.returnToQM,
          Developer_x0020_Status: approvalFormStateValues.devStatus,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          Is_x0020_Dev_x0020_Completed: approvalFormStateValues.isDevCompleted,
          Assigned_x0020_ToId: assignedTo,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          QA_x0020_ResourceId: qaassignedTo,
          Developer_x0020_ResourceId: null,
          DevelopmentManagerId: null,
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Dev_x0020_Actual_x0020_Hours: approvalFormStateValues.devActualHrs,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          Dev_x0020_Percent_x0020_Complete: approvalFormStateValues.devPercentComplete,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Expected_x0020_Due_x00: approvalFormStateValues.devExpectedDueDate,
          Dev_x0020_Dated_x0020_Notes: datedNotes,
          Dev_x0020_any_x0020_request_x002: approvalFormStateValues.devAreRequestChanges,
          Dev_x0020_Follow_x002d_up: approvalFormStateValues.devFollowUp,
          Dev_x0020_due_x0020_date_x0020_e: approvalFormStateValues.devReqExplanation,
          Dev_x0020_Explain: approvalFormStateValues.devExplain,
          CompletionDate: completionDate,
          QA_x0020_Issues: approvalFormStateValues.qaIssues,
          NegotiatedDueDate: approvalFormStateValues.NegotiatedDueDate,
        });
      } else {
        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Status: status,
          Return_x0020_to_x0020_QM: approvalFormStateValues.returnToQM,
          Developer_x0020_Status: approvalFormStateValues.devStatus,
          Is_x0020_Dev_x0020_Completed: approvalFormStateValues.isDevCompleted,
          Assigned_x0020_ToId: assignedTo,
          Is_x0020_QA_x0020_Required: approvalFormStateValues.isQARequired,
          QA_x0020_ResourceId: qaassignedTo,
          Comments: comments,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
          Dev_x0020_Actual_x0020_Hours: approvalFormStateValues.devActualHrs,
          Dev_x0020_Estimated_x0020_Hours: approvalFormStateValues.devEstimatedHrs,
          Dev_x0020_Percent_x0020_Complete: approvalFormStateValues.devPercentComplete,
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          Dev_x0020_Expected_x0020_Due_x00: approvalFormStateValues.devExpectedDueDate,
          Dev_x0020_Dated_x0020_Notes: datedNotes,
          Dev_x0020_any_x0020_request_x002: approvalFormStateValues.devAreRequestChanges,
          Dev_x0020_Follow_x002d_up: approvalFormStateValues.devFollowUp,
          Dev_x0020_due_x0020_date_x0020_e: approvalFormStateValues.devReqExplanation,
          Dev_x0020_Explain: approvalFormStateValues.devExplain,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          CompletionDate: completionDate,
          QA_x0020_Issues: approvalFormStateValues.qaIssues,
          NegotiatedDueDate: approvalFormStateValues.NegotiatedDueDate,
        });
      }

      return inputData;
    }
    else if (approvalFormStateValues.status === "Sent to QA") {
      let comments = "";
      let inputData;
      let qaassignedTo = null;
      let assignedTo = null;
      let status = "";

      let datedNotes = "";
      if (
        approvalFormStateValues.qaApproveRequest === "Yes" &&
        approvalFormStateValues.qaDatedNotes != null &&
        approvalFormStateValues.qaDatedNotes !== ""
      ) {
        datedNotes = `${today}: ${approvalFormStateValues.qaDatedNotes}; `;
      }

      let qaResourceId = getIdFromPeopleFiled(approvalFormStateValues.qaResource);

      if (approvalFormStateValues.isQAChanged === true) {
        qaassignedTo = approvalFormStateValues.qaResourceId;
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}]<br/>`;

        inputData = JSON.stringify({
          __metadata: { type: "SP.Data.RequestsListItem" },
          Status: "Sent to QA",
          Comments: comments,
          QA_x0020_ResourceId: qaassignedTo,
          Assigned_x0020_ToId: qaassignedTo,
          QAReAssign: "No",
          Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
          QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
          QA_x0020_Hours_x0020__x0028_actu: approvalFormStateValues.qaActualHrs,
          WorkingMonth: approvalFormStateValues.WorkingMonth,
          QA_x0020_Percent_x0020_Complete: approvalFormStateValues.qaPercentComplete,
          Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
        });
      } else {
        if (approvalFormStateValues.qaReturnToQM === "Yes") {
          status = "Sent to QM";
          comments =
            approvalFormStateValues.comments != null &&
              approvalFormStateValues.comments !== ""
              ? `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
              : `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}]<br/>`;
          assignedTo = configpermission?.QMGrpId; // Replace with actual QM group ID
          inputData = JSON.stringify({
            __metadata: { type: "SP.Data.RequestsListItem" },
            Assigned_x0020_ToId: assignedTo,
            Status: status,
            Qa_x0020_Approved_x0020_Request: approvalFormStateValues.qaApproveRequest,
            Comments: comments,
            Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
            QA_x0020_Return_x0020_to_x0020_Q: approvalFormStateValues.qaReturnToQM,
            QAReAssign: approvalFormStateValues.qaReassign,
            Developer_x0020_ResourceId: null,
            DevelopmentManagerId: null,
            QA_x0020_Issues: approvalFormStateValues.qaIssues,
            QA_x0020_ResourceId: null,
            Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
            QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
            QA_x0020_Hours_x0020__x0028_actu: approvalFormStateValues.qaActualHrs,
            WorkingMonth: approvalFormStateValues.WorkingMonth,
            QA_x0020_Percent_x0020_Complete: approvalFormStateValues.qaPercentComplete,
          });
        } else if (approvalFormStateValues.qaApproveRequest === "Yes") {
          status = "Sent to UAT";
          assignedTo = approvalFormStateValues.businessRequester;
          comments =
            approvalFormStateValues.comments != null &&
              approvalFormStateValues.comments !== ""
              ? `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
              : `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}]<br/>`;
          inputData = JSON.stringify({
            __metadata: { type: "SP.Data.RequestsListItem" },
            Assigned_x0020_ToId: assignedTo,
            Status: status,
            Qa_x0020_Approved_x0020_Request: approvalFormStateValues.qaApproveRequest,
            Comments: comments,
            Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
            QA_x0020_Hours_x0020__x0028_actu: approvalFormStateValues.qaActualHrs,
            QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
            QA_x0020_hours: approvalFormStateValues.qaHours,
            QA_x0020_Issues: approvalFormStateValues.qaIssues,
            QA_x0020_Expected_x0020_Due_x002: approvalFormStateValues.qaExpectedDueDate,
            QA_x0020_Negotiated_x0020_Due_x0: approvalFormStateValues.qaDueDate,
            QA_x0020_Dated_x0020_Notes: datedNotes,
            QA_x0020_Request_x0020_Changes: approvalFormStateValues.qaRequestChanges,
            QA_x0020_Reason_x0020_request_x0: approvalFormStateValues.qaReqNotTimely,
            QA_x0020_Follow_x0020_Up: approvalFormStateValues.qaFollowUp,
            QA_x0020_Percent_x0020_Complete: approvalFormStateValues.qaPercentComplete,
            QA_x0020_Return_x0020_to_x0020_Q: approvalFormStateValues.qaReturnToQM,
            QAReAssign: approvalFormStateValues.qaReassign,
            Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
            isQARequestChanges: approvalFormStateValues.IsQARequestChanges,
            WorkingMonth: approvalFormStateValues.WorkingMonth,
            CompletionDate: new Date().toISOString(),
          });
        } else if (approvalFormStateValues.qaApproveRequest === "No") {
          status = "Sent to Developer";
          assignedTo = getIdFromPeopleFiled(approvalFormStateValues.devResource);
          comments =
            approvalFormStateValues.comments != null &&
              approvalFormStateValues.comments !== ""
              ? `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
              : `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}]<br/>`;
          inputData = JSON.stringify({
            __metadata: { type: "SP.Data.RequestsListItem" },
            Assigned_x0020_ToId: assignedTo,
            Status: status,
            Qa_x0020_Approved_x0020_Request: approvalFormStateValues.qaApproveRequest,
            Comments: comments,
            Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
            QA_x0020_Return_x0020_to_x0020_Q: approvalFormStateValues.qaReturnToQM,
            QAReAssign: approvalFormStateValues.qaReassign,
            QA_x0020_Issues: approvalFormStateValues.qaIssues,
            QA_x0020_Dated_x0020_Notes: approvalFormStateValues.qaDatedNotes,
            Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
            QA_x0020_Request_x0020_Changes: approvalFormStateValues.qaRequestChanges,
            isQARequestChanges: approvalFormStateValues.IsQARequestChanges,
            QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
            QA_x0020_Hours_x0020__x0028_actu: approvalFormStateValues.qaActualHrs,
            WorkingMonth: approvalFormStateValues.WorkingMonth,
            QA_x0020_Percent_x0020_Complete: approvalFormStateValues.qaPercentComplete,
          });
        } else if (approvalFormStateValues.qaApproveRequest === "In Progress") {
          status = "Sent to QA";
          qaResourceId = getIdFromPeopleFiled(approvalFormStateValues.qaResource);
          assignedTo = qaResourceId;
          qaassignedTo = qaResourceId;
          comments =
            approvalFormStateValues.comments != null &&
              approvalFormStateValues.comments !== ""
              ? `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
              : `[${today}: ${status}] <br/> [${today}: Comments by QA - ${currUserTitle}]<br/>`;
          inputData = JSON.stringify({
            __metadata: { type: "SP.Data.RequestsListItem" },
            Assigned_x0020_ToId: assignedTo,
            Status: status,
            Qa_x0020_Approved_x0020_Request: approvalFormStateValues.qaApproveRequest,
            Comments: comments,
            Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
            QA_x0020_Return_x0020_to_x0020_Q: approvalFormStateValues.qaReturnToQM,
            QAReAssign: approvalFormStateValues.qaReassign,
            QA_x0020_ResourceId: qaassignedTo,
            QA_x0020_Issues: approvalFormStateValues.qaIssues,
            QA_x0020_Dated_x0020_Notes: approvalFormStateValues.qaDatedNotes,
            Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
            QA_x0020_Request_x0020_Changes: approvalFormStateValues.qaRequestChanges,
            isQARequestChanges: approvalFormStateValues.IsQARequestChanges,
            QA_x0020_Estimated_x0020_hours: approvalFormStateValues.qaEstimatedHrs,
            QA_x0020_Hours_x0020__x0028_actu: approvalFormStateValues.qaActualHrs,
            WorkingMonth: approvalFormStateValues.WorkingMonth,
            QA_x0020_Percent_x0020_Complete: approvalFormStateValues.qaPercentComplete,
          });
        }
      }

      return inputData;
    }
    else if (approvalFormStateValues.status === "Sent to UAT") {
      let comments = "";
      let assignedTo = null;
      let status = "";

      if (approvalFormStateValues.uatApproveRequest === "Yes") {
        status = "Completed";
        assignedTo = null;
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by UAT - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by UAT - ${currUserTitle}]<br/>`;
      } else if (approvalFormStateValues.uatApproveRequest === "No") {
        status = "Sent to Developer";
        assignedTo = getIdFromPeopleFiled(approvalFormStateValues.devResource);
        comments =
          approvalFormStateValues.comments != null &&
            approvalFormStateValues.comments !== ""
            ? `[${today}: ${status}] <br/> [${today}: Comments by UAT - ${currUserTitle}] - ${approvalFormStateValues.comments}<br/>`
            : `[${today}: ${status}] <br/> [${today}: Comments by UAT - ${currUserTitle}]<br/>`;
      }

      const inputData = JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Assigned_x0020_ToId: assignedTo,
        Status: status,
        UAT_x0020_Approved_x0020_Request: "Yes",
        Comments: comments,
        Dev_x0020_Negotiated_x0020_Due_x: approvalFormStateValues.devDueDate,
        Previous_x0020_Comments: String(approvalFormStateValues.prevComments),
      });

      return inputData;
    }

  };



  const createRejectInputConditions = () => {
    const today = moment(new Date()).format("MM/DD/YYYY HH:mm");
    const currUserTitle = props.dashBoardState?.currentUser.Title;
    const { prevComments, status, IsSensitiveFlag, comments, reqmanager } = approvalFormStateValues;
    const QMGrpId = props?.configpermission?.QMGrpId;

    const createInputData = (status: string, assignedTo: number, messageType: string) => {
      const commentPrefix = `[${today}: ${status}]<br/>[${today}: Comments by ${status} - ${currUserTitle}]`;
      const commentSuffix = comments ? `Rejected - ${comments}<br/>` : 'Rejected<br/>';
      const fullComments = `${commentPrefix} ${commentSuffix}`;

      return JSON.stringify({
        __metadata: { type: "SP.Data.RequestsListItem" },
        Previous_x0020_Comments: String(prevComments || ""),
        Comments: fullComments,
        Status: status,
        [messageType]: "Yes",
        Assigned_x0020_ToId: assignedTo,
      });
    };

    switch (status) {
      case "Sent to Manager PHI-PII":
        const assignedToPHI = IsSensitiveFlag === "Yes" ? reqmanager : QMGrpId;
        const statusPHI = IsSensitiveFlag === "Yes" ? "Sent to Manager Sensitive" : "Sent to QM";
        return createInputData(statusPHI, assignedToPHI, "ShowPHIMessage");

      case "Sent to Manager Sensitive":
        return createInputData("Sent to QM", QMGrpId, "ShowSensitiveMessage");

      case "Sent to VP":
        return createInputData("Sent to QM", QMGrpId, "ShowSensitiveMessage");

      case "Sent to IRO":
        return createInputData("Sent to QM", QMGrpId, "ShowSensitiveMessage");

      default:
        return null;
    }
  };

  const getIdFromPeopleFiled = (peopleField: any[]) => {
    let id = null;
    if (peopleField && peopleField.length > 0) {
      id = peopleField[0].id || peopleField[0].Id;
    }
    return id;
  };
  console.log(getIdFromPeopleFiled)
  const GetManager = async (loginname: string) => {

    try {
      const user = await web.ensureUser(loginname);
      const manager = await web.getUserById(user.data.Id).get();
      setManagerid(manager.Id);
      return manager.Id;
    } catch (error) {
      util.writeErrorLog("ApprovalForm.tsx", "GetManager", error.status.toString(), LogLevel.Error, error.responseText);
    }
  };
  // console.log(GetManager)

  let formtitle =
    props?.approvalData.status == "Sent to Developer" ||
      props?.approvalData.status == "Sent to Developer - Design" ||
      props?.approvalData.status == "Sent to Developer - Development"
      ? "Development Form - " + props?.approvalData.Request_x0020_No
      : props?.approvalData.status == "Sent to QA"
        ? "Quality Assurance Form - " + props?.approvalData.Request_x0020_No
        : props?.approvalData.status == "Sent to UAT"
          ? "User Acceptance Form - " + props?.approvalData.Request_x0020_No
          : "Request Review Form - " + props?.approvalData.Request_x0020_No;

  // ************** this is custom header and custom Footers section functions for panel *************

  const ValidatePercent = (event: any) => {
    const { value } = event.target;
    return 0 < value && value <= 100;
  };

  const handleButtonActions = (action: any) => {
    if (action === "Ok") {
      props?.setState((prevState: any) => ({
        ...prevState,

        hideDialog: true,

      }));

    }

  };
  return (
    <div id="approvalForm">
      <Panel
        type={PanelType.large}
        headerText={formtitle}
        isOpen={props?.OpenApprovalPopup}
        onDismiss={() => {
          setApprovalFormStateValues((prevState: any) => ({
            ...prevState,
            Id: null
          })), props?.setOpenApprovalPopup(false)
        }}
        isBlocking={true}
      >
        {approvalFormStateValues?.Id != null && approvalFormStateValues?.Id != undefined ?
          <div>
            <div className='approvalFormBody'>
              {approvalFormStateValues.shdVIPInfo == "Yes" && approvalFormStateValues.IsVIPMessageFlag == "Yes" &&
                <div className='mb-2'>
                  <b>Note: {props?.configpermission?.VIPMessage}</b>
                </div>}

              {approvalFormStateValues.shdVIPInfo == "Yes" && approvalFormStateValues.IsVIPMessageFlag == "No" &&
                <div className='mb-2'>

                  <b>Note: {props?.configpermission?.HasVIPAccessMessage}</b>

                </div>}
              {approvalFormStateValues.ShowPHIMessage == "Yes" &&
                (approvalFormStateValues.status == "Sent to Developer" ||
                  approvalFormStateValues.status == "Sent to QM") && <div className='mb-2'>
                  <b>Note: {props?.configpermission?.PHIPIIMessage}</b>
                </div>}
              {approvalFormStateValues.ShowSensitiveMessage == "Yes" &&
                (approvalFormStateValues.status == "Sent to Developer" ||
                  approvalFormStateValues.status == "Sent to QM") &&
                <div className='mb-2'>
                  <b>Note: {props?.configpermission?.SensitiveMessage}</b>
                </div>}
              <div className="mb-3 requestFormTabs">
                <div className={
                  props?.dashBoardState.isQM == true &&
                    approvalFormStateValues.status == "Pend to"
                    ? "col-md-4"//"width97 upload-btn-wrapper form-control"
                    : approvalFormStateValues.status ==
                      "Sent to QM - Hold" ||
                      approvalFormStateValues.status == "Sent to QM" ? "col-md-4"
                      : "col-md-6"}>
                  <a href={`${props?.props?.editRequestUrl}?ItemId=${props.approvalData?.Id}&PageMode=View`} data-interception="off" target="_blank">
                    View request
                  </a>
                </div>
                {(props.dashBoardState.isQM == true &&
                  (approvalFormStateValues.status == "Pend to" || approvalFormStateValues.status ==
                    "Sent to QM - Hold" ||
                    approvalFormStateValues.status == "Sent to QM")) && <div className='col-md-4'
                      style={{ textAlign: "center" }}
                    >


                    <a href={`${props?.props?.editRequestUrl}?ItemId=${props.approvalData?.Id}&PageMode=Edit`} data-interception="off" target="_blank">
                      Edit request
                    </a>

                  </div>}

                <div className={
                  approvalFormStateValues.status != "Sent For Department Approval" &&

                    props.dashBoardState.isQM == true &&
                    approvalFormStateValues.status == "Pend to"
                    ? "col-md-4"
                    : approvalFormStateValues.status ==
                      "Sent to QM - Hold" ||
                      approvalFormStateValues.status == "Sent to QM" ?
                      "col-md-4" : "col-md-6"

                }>

                  <a href="javascript:" onClick={showLib}>
                    Upload or View Attachments
                  </a>

                </div>
              </div>
              <div className='formDivSequence'>
                {(approvalFormStateValues.status == "Sent to QM" ||
                  approvalFormStateValues.status == "Sent to QM - Hold" ||
                  approvalFormStateValues.status == "Pend to")
                  && <div className='mb-3'>
                    <label className='form-label w-100'>
                      {" "}
                      Select Status: {" "}
                    </label>
                    <select
                      name="qMStatus"
                      className="width97 form-control"
                      value={approvalFormStateValues.qMStatus}
                      onChange={(e) => setFieldValues("qMStatus", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Development">Development</option>
                      <option value="Pending">Pending</option>
                      <option value="Hold">Hold</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                    {(approvalFormStateValues.status == "Sent to QM" ||
                      approvalFormStateValues.status == "Sent to QM - Hold" ||
                      approvalFormStateValues.status == "Pend to") &&
                      approvalFormStateValues.qMStatus == "" &&
                      props?.dashBoardState.btnClick == "Submit" && (
                        <div className="errorMessage marginLeft50">
                          Field is required
                        </div>
                      )}
                  </div>}
                <div className='row'>
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>Return to Queue Manager?: </label>
                      <span className="boolLb1 me-3">
                        <input className='form-check-input'
                          type="radio"
                          name="qaReturnToQM"
                          value="No"
                          checked={
                            approvalFormStateValues.qaReturnToQM == "No"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("qaReturnToQM", e.target.value)}
                        />
                        <span className='ms-1'>No</span>
                      </span>
                      <span>
                        <input className='form-check-input'
                          type="radio"
                          name="qaReturnToQM"
                          value="Yes"
                          disabled={approvalFormStateValues.status == "Sent to QA" && approvalFormStateValues.qaApproveRequest != "In Progress" ? true : false}
                          checked={
                            approvalFormStateValues.qaReturnToQM == "Yes"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("qaReturnToQM", e.target.value)}
                        />
                        <span className='ms-1'>Yes</span>
                      </span>
                    </div>}
                  {(approvalFormStateValues.status == "Sent to Developer" || approvalFormStateValues.status == "Sent to Developer - Development") &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Return to Queue Manager?:
                      </label>
                      <span className="boolLb1 me-3">
                        <input className='form-check-input'
                          type="radio"
                          name="returnToQM"
                          value="No"
                          checked={
                            approvalFormStateValues.returnToQM == "No"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("returnToQM", e.target.value)}
                        />
                        <span className='ms-1'>No</span>
                      </span>
                      <span>
                        <input className='form-check-input'
                          type="radio"
                          name="returnToQM"
                          value="Yes"
                          checked={
                            approvalFormStateValues.returnToQM == "Yes"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("returnToQM", e.target.value)}
                        />
                        <span className='ms-1'>Yes</span>
                      </span>
                    </div>}

                  {(approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    props.dashBoardState.isQM == true) &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>Reassign QA Resource?: </label>
                      <span className="boolLb1 me-3">
                        <input className='form-check-input'
                          type="radio"
                          name="qaReassign"
                          value="No"
                          checked={
                            approvalFormStateValues.qaReassign == "No"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setFieldValues("qaReassign", e.target.value);

                            if (e.target.value === "No" && approvalFormStateValues.status == "Sent to QA") {
                              setFieldValues("qaResource", copyRequestData.qaResource);
                            }
                          }}
                        />
                        <span className='ms-1'>No</span>
                      </span>
                      <span>
                        <input className='form-check-input'
                          type="radio"
                          name="qaReassign"
                          value="Yes"
                          disabled={approvalFormStateValues.status == "Sent to QA" && approvalFormStateValues.qaApproveRequest != "In Progress" ? true : false}
                          checked={
                            approvalFormStateValues.qaReassign == "Yes"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("qaReassign", e.target.value)}
                        />
                        <span className='ms-1'>Yes</span>
                      </span>
                    </div>}
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        Approve Request Results?
                      </label>
                      <select
                        className="form-control"
                        name="qaApproveRequest"
                        value={approvalFormStateValues.qaApproveRequest || "In Progress"}
                        onChange={(e) => setFieldValues("qaApproveRequest", e.target.value)}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>}
                  {(approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" ||
                    approvalFormStateValues.status == "Pend to") &&
                    approvalFormStateValues.qMStatus == "Development" &&
                    <div className='col-md-4 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Assign Developer Resource:{" "}
                      </label>
                      <PeoplePicker
                        context={props.props.context}
                        titleText=""
                        personSelectionLimit={1}
                        groupName={""}
                        required={false}
                        ensureUser={true}
                        onChange={handlePeoplePickerChange.bind(
                          null,
                          "devResource"
                        )}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000}
                        defaultSelectedUsers={[
                          approvalFormStateValues.devResource != undefined &&
                            approvalFormStateValues.devResource.length != 0
                            ? approvalFormStateValues.devResource[0]
                              .secondaryText == undefined
                              ? approvalFormStateValues.devResource[0].EMail
                              : approvalFormStateValues.devResource[0]
                                .secondaryText
                            : "",
                        ]}
                      />


                      {(approvalFormStateValues.status == "Sent to QM" ||
                        approvalFormStateValues.status == "Sent to QM - Hold" ||
                        approvalFormStateValues.status == "Pend to") &&
                        approvalFormStateValues.qMStatus == "Development" &&
                        (approvalFormStateValues.devResource == undefined ||
                          (approvalFormStateValues.devResource != undefined &&
                            approvalFormStateValues.devResource.length == 0)) &&
                        props?.dashBoardState.btnClick == "Submit" && (
                          <div className="errorMessage marginLeft50">
                            Field is required
                          </div>
                        )}
                    </div>}
                  {(((approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" ||
                    approvalFormStateValues.status == "Pend to") &&
                    approvalFormStateValues.qMStatus == "Development") || (approvalFormStateValues.status ==
                      "Sent to Developer" ||
                      approvalFormStateValues.status ==
                      "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No") &&
                    <div className={approvalFormStateValues.returnToQM == "No" && approvalFormStateValues.qMStatus == "Development" && approvalFormStateValues.status !==
                      "Sent to Developer" ? 'col-md-4 mb-3' : 'col-md-6 mb-3'}>
                      <label className='form-label w-100'>
                        {" "}
                        Is QA required?:
                      </label>
                      <select
                        className="width97 form-control"
                        name="isQARequired"
                        value={approvalFormStateValues.isQARequired}
                        onChange={(e) => setFieldValues("isQARequired", e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>}
                  {(((approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" ||
                    approvalFormStateValues.status == "Pend to") &&
                    approvalFormStateValues.qMStatus == "Development" &&
                    approvalFormStateValues.isQARequired == "Yes") || (approvalFormStateValues.status == "Sent to QA" &&
                      props.dashBoardState.isQM == true &&
                      approvalFormStateValues.qaReturnToQM == "No" &&
                      approvalFormStateValues.qaReassign == "Yes") || ((approvalFormStateValues.status ==
                        "Sent to Developer" ||
                        approvalFormStateValues.status ==
                        "Sent to Developer - Development") &&
                        approvalFormStateValues.isQARequired == "Yes" &&
                        approvalFormStateValues.returnToQM == "No")) &&
                    <div className={approvalFormStateValues.returnToQM == "No" && approvalFormStateValues.qMStatus == "Development" && approvalFormStateValues.status !==
                      "Sent to Developer" ? 'col-md-4 mb-3' : 'col-md-6 mb-3'}>
                      <label className='form-label w-100'>
                        {" "}
                        QA Resource:
                      </label>
                      <PeoplePicker
                        context={props.props.context}
                        titleText=""
                        personSelectionLimit={1}
                        groupName={""}
                        required={false}
                        ensureUser={true}
                        onChange={handlePeoplePickerChange.bind(
                          null,
                          "qaResource"
                        )}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000}
                        defaultSelectedUsers={[
                          approvalFormStateValues.qaResource != undefined &&
                            approvalFormStateValues.qaResource.length != 0
                            ? approvalFormStateValues.qaResource[0]
                              .secondaryText == undefined
                              ? approvalFormStateValues.qaResource[0].EMail
                              : approvalFormStateValues.qaResource[0]
                                .secondaryText
                            : "",
                        ]}
                      />


                      {(approvalFormStateValues.status == "Sent to QM" ||
                        approvalFormStateValues.status == "Sent to QM - Hold" ||
                        approvalFormStateValues.status == "Pend to" ||
                        approvalFormStateValues.status == "Sent to Developer" ||
                        approvalFormStateValues.status ==
                        "Sent to Developer - Development" ||
                        approvalFormStateValues.status == "Sent to QA") &&
                        approvalFormStateValues.qMStatus == "Development" &&
                        props?.dashBoardState.btnClick == "Submit" &&
                        (approvalFormStateValues.qaResource == undefined ||
                          (approvalFormStateValues.qaResource != undefined &&
                            approvalFormStateValues.qaResource.length == 0)) && (
                          <div className="errorMessage marginLeft50">
                            Field is required
                          </div>
                        )}
                    </div>}
                </div>
                {(approvalFormStateValues.status == "Sent to QM" ||
                  approvalFormStateValues.status == "Sent to QM - Hold" ||
                  approvalFormStateValues.status == "Pend to") &&
                  (approvalFormStateValues.qMStatus == "Pending") &&
                  <div className='mb-3'>
                    <label className='form-label w-100'>
                      {" "}
                      Assign To:
                    </label>
                    <PeoplePicker
                      context={props.props.context}
                      titleText=""
                      personSelectionLimit={1}
                      groupName={""}
                      showtooltip={props?.dashBoardState?.buttonClick === 1}
                      required={props?.dashBoardState?.buttonClick === 1}
                      ensureUser={true}
                      onChange={handlePeoplePickerChange.bind(
                        null,
                        "pendToResource"
                      )}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      resolveDelay={1000}
                      defaultSelectedUsers={[
                        approvalFormStateValues.pendToResource?.length !== 0
                          ? approvalFormStateValues.pendToResource?.[0]?.secondaryText == undefined
                            ? approvalFormStateValues.pendToResource?.[0]?.EMail
                            : approvalFormStateValues.pendToResource?.[0]?.secondaryText
                          : "",
                      ]}

                    />


                    {(approvalFormStateValues.status == "Sent to QM" ||
                      approvalFormStateValues.status == "Sent to QM - Hold" ||
                      approvalFormStateValues.status == "Pend to") &&
                      approvalFormStateValues.qMStatus == "Pending" &&
                      (approvalFormStateValues.pendToResource == undefined ||
                        (approvalFormStateValues.pendToResource != undefined &&
                          approvalFormStateValues.pendToResource.length ==
                          0)) &&
                      props?.dashBoardState.btnClick == "Submit" && (
                        <div className="errorMessage marginLeft50">
                          Field is required
                        </div>
                      )}
                  </div>}
                <div className='row'>
                  {approvalFormStateValues.status == "Pend to" || approvalFormStateValues.status == "Sent to QM" &&
                    <>

                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Expected Due Date:
                        </label>
                        <DatePicker
                          value={approvalFormStateValues.reqDueDate}
                          className="datefldnot"
                          minDate={TodayCopy}
                          onSelectDate={(val) =>
                            setFieldValues("reqDueDate", val)
                          }
                        ></DatePicker>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Negotiated Due Date:
                        </label>
                        <DatePicker
                          value={approvalFormStateValues.devDueDate}
                          className="datefldnot"
                          minDate={TodayCopy}
                          onSelectDate={(val) =>
                            setFieldValues("devDueDate", val)
                          }
                        ></DatePicker>
                      </div>
                    </>}
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" &&
                    <>

                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Expected Due Date:
                        </label>
                        <DatePicker
                          disabled={true}
                          value={approvalFormStateValues.reqDueDate}
                          className="datefldnot"
                          onSelectDate={(val) =>
                            setFieldValues("reqDueDate", val)
                          }
                        ></DatePicker>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Negotiated Due Date:
                        </label>
                        <DatePicker
                          value={approvalFormStateValues.devDueDate}
                          className=""
                          minDate={TodayCopy}
                          onSelectDate={(val) =>
                            setFieldValues("devDueDate", val)
                          }
                        ></DatePicker>
                      </div>
                    </>}

                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <>
                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Expected Due Date:
                        </label>
                        <DatePicker
                          disabled
                          value={approvalFormStateValues.reqDueDate}
                          className="datefldnot"
                          onSelectDate={(val) =>
                            setFieldValues("reqDueDate", val)
                          }
                        ></DatePicker>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Negotiated Due Date:
                        </label>
                        <DatePicker
                          value={
                            approvalFormStateValues.devDueDate //!= null

                          }
                          className="width97"
                          minDate={TodayCopy}
                          onSelectDate={(val) => {
                            approvalFormStateValues.devDueDate = val
                          }}
                        ></DatePicker>
                      </div>
                    </>}
                </div>
                <div className='row'>
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design") &&
                    approvalFormStateValues.devStatus == "Development" &&
                    approvalFormStateValues.returnToQM == "No" && <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        Is Development Completed?
                      </label>
                      <select
                        name="isDevCompleted"
                        className="width97 form-control"
                        value={approvalFormStateValues.isDevCompleted || "No"}
                        onChange={(e) => setFieldValues("isDevCompleted", e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>

                    </div>}
                </div>
                <div className='row'>
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" && <>


                      <div className="col-md-3 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Estimated Dev Hours:
                        </label>
                        <input
                          disabled={true}
                          type="number"
                          name="devEstimatedHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.devEstimatedHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("devEstimatedHrs", value); }
                          }}
                        ></input>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Actual Dev Hours:
                        </label>
                        <input
                          type="number"
                          name="devActualHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.devActualHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("devActualHrs", value); }
                          }}
                        ></input>
                      </div>

                      <div className="col-md-3 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Dev % Complete:
                        </label>
                        <div className="align-items-center d-flex gap-1 percentagefld">
                          <input
                            type="number"
                            name="devPercentComplete"
                            className="form-control"
                            max={100}
                            min={0}
                            value={approvalFormStateValues.devPercentComplete}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                setFieldValues("devPercentComplete", "");
                              } else {
                                const numericValue = parseInt(value, 10);
                                if (numericValue >= 0 && numericValue <= 100) {
                                  setFieldValues("devPercentComplete", numericValue.toString());
                                }
                              }
                            }}
                          />
                          <span>%</span>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Estimated QA Hours
                        </label>
                        <input
                          disabled={true}
                          type="number"
                          name="qaEstimatedHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.qaEstimatedHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("qaEstimatedHrs", value); }
                          }}
                        ></input>
                      </div>
                    </>}
                </div>

                <div className='row'>
                  {approvalFormStateValues.status == "Pend to" || approvalFormStateValues.status == "Sent to QM" &&
                    <>
                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Estimated Dev Hours :
                        </label>
                        <input
                          type="number"
                          name="devEstimatedHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.devEstimatedHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("devEstimatedHrs", value); }
                          }}
                        ></input>
                      </div>
                      <div className='col-md-6 mb-3'>
                        <label className='form-label w-100'>
                          {" "}
                          Estimated QA Hours
                        </label>
                        <input
                          type="number"
                          name="qaEstimatedHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.qaEstimatedHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) {
                              setFieldValues("qaEstimatedHrs", value);
                            }
                          }}
                        ></input>
                      </div>
                    </>}

                </div>
                <div className='row'>
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <>
                      <div className="col mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Estimated QA Hours:
                        </label>
                        <input
                          disabled={true}
                          type="number"
                          name="qaEstimatedHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.qaEstimatedHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("qaEstimatedHrs", value); }
                          }}
                        ></input>
                      </div>
                      <div className="col mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Actual QA hours
                        </label>
                        <input
                          type="number"
                          name="qaActualHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.qaActualHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("qaActualHrs", value); }
                          }}
                        ></input>
                      </div>
                      <div className="col mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          QA %  Complete:
                        </label>
                        <div className="align-items-center d-flex gap-1 percentagefld">
                          <input
                            type="number"
                            name="qaPercentComplete"
                            className="form-control"
                            max={100}
                            value={approvalFormStateValues.qaPercentComplete}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                setFieldValues("qaPercentComplete", "");
                              } else {
                                const numericValue = parseInt(value, 10);
                                if (numericValue >= 0 && numericValue <= 100) {
                                  setFieldValues("qaPercentComplete", numericValue.toString());
                                }
                              }
                            }}
                          ></input>
                          <span>%</span>
                        </div>
                      </div>
                      <div className="col mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Estimated Dev Hours:
                        </label>
                        <input
                          disabled={true}
                          type="number"
                          name="devEstimatedHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.devEstimatedHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("devEstimatedHrs", value); }
                          }}
                        ></input>
                      </div>
                      <div className="col mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Actual Dev Hours:
                        </label>
                        <input
                          disabled={true}
                          type="number"
                          name="devActualHrs"
                          className="form-control number maxLength3"
                          maxLength={3}
                          value={approvalFormStateValues.devActualHrs}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) { setFieldValues("devActualHrs", value); }
                          }}
                        ></input>
                      </div>
                    </>}
                </div>
                <div className='row'>
                  {/* QM , Pending Form Changes :  Adding new Drop downs  */}
                  {(approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" ||
                    approvalFormStateValues.status == "Pend to") &&
                    approvalFormStateValues.DepartmentTitle != "Sales" &&
                    <>

                      <div className="col-md-4 mb-3">
                        <label className='form-label w-100'>
                          Regulatory Compliance
                          <span className="ReqField">*</span>
                        </label>
                        <div className="inputDiv">
                          <select
                            name="RegulatoryCompliance"
                            className="form-control"
                            value={approvalFormStateValues.RegulatoryCompliance}
                            onChange={(e) => setFieldValues("RegulatoryCompliance", e.target.value)}
                          >
                            <option value={"0"}>Select</option>
                            <option value={"Yes"}>Yes</option>
                            <option value={"No"}>No</option>
                          </select>

                          {props?.dashBoardState.btnClick == "Submit" &&
                            approvalFormStateValues.RegulatoryCompliance == "0" && (
                              <div className="errorMessage">Field is required</div>
                            )}
                        </div>
                      </div>


                      {approvalFormStateValues.RegulatoryCompliance == "No" && <div className='col-md-4 mb-3'>
                        <label className='form-label w-100'>
                          Quality/ Health Outcomes
                          <span className="ReqField">*</span>
                        </label>

                        <div className="inputDiv">
                          <select
                            name="QualityHealthOutcome"
                            className="form-control"
                            value={approvalFormStateValues.QualityHealthOutcome}
                            onChange={(e) => setFieldValues("QualityHealthOutcome", e.target.value)}
                          >
                            <option value={"0"}>Select</option>
                            <option value={"N/A"}>0 – N/A</option>
                            <option value={"Slightly"}>1 – Slightly</option>
                            <option value={"Moderately"}>2 – Moderately</option>
                            <option value={"Significantly"}>3 – Significantly</option>

                          </select>

                          {props?.dashBoardState.btnClick == "Submit" &&
                            approvalFormStateValues.QualityHealthOutcome == "0" && (
                              <div className="errorMessage">Field is required</div>
                            )}
                        </div>
                      </div>}
                      {approvalFormStateValues.RegulatoryCompliance == "No" && <div className='col-md-4 mb-3'>
                        <label className='form-label w-100'>
                          Medical Cost Reduction
                          <span className="ReqField">*</span>
                        </label>

                        <div className="inputDiv">
                          <select
                            name="MedicalCostreduction"
                            className="form-control"
                            value={approvalFormStateValues.MedicalCostreduction}
                            onChange={(e) => setFieldValues("MedicalCostreduction", e.target.value)}
                          >
                            <option value={"0"}>Select</option>
                            <option value={"N/A"}>0 – N/A</option>
                            <option value={"Slightly"}>1 – Slightly</option>
                            <option value={"Moderately"}>2 – Moderately</option>
                            <option value={"Significantly"}>3 – Significantly</option>


                          </select>

                          {props?.dashBoardState.btnClick == "Submit" &&
                            approvalFormStateValues.MedicalCostreduction == "0" && (
                              <div className="errorMessage">Field is required</div>
                            )}
                        </div>
                      </div>}

                    </>}
                  {(approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" ||
                    approvalFormStateValues.status == "Pend to") &&
                    approvalFormStateValues.DepartmentTitle != "Sales" && <>

                      {approvalFormStateValues.RegulatoryCompliance == "No" &&
                        <div className='col-md-4 mb-3'>
                          <label className='form-label w-100'>
                            Market Share
                            <span className="ReqField">*</span>
                          </label>

                          <div className="inputDiv">
                            <select
                              name="MarketShare"
                              className="form-control"
                              value={approvalFormStateValues.MarketShare}
                              onChange={(e) => setFieldValues("MarketShare", e.target.value)}
                            >
                              <option value={"0"}>Select</option>
                              <option value={"N/A"}>0 – N/A</option>
                              <option value={"Slightly"}>1 – Slightly</option>
                              <option value={"Moderately"}>2 – Moderately</option>
                              <option value={"Significantly"}>3 – Significantly</option>

                            </select>

                            {props?.dashBoardState.btnClick == "Submit" &&
                              approvalFormStateValues.MarketShare == "0" && (
                                <div className="errorMessage">Field is required</div>
                              )}
                          </div>
                        </div>}
                      {approvalFormStateValues.RegulatoryCompliance == "No" &&
                        <div className='col-md-4 mb-3'>
                          <label className='form-label w-100'>
                            Provider Vitality
                            <span className="ReqField">*</span>
                          </label>

                          <div className="inputDiv">
                            <select
                              name="ProviderVitality"
                              className="form-control"
                              value={approvalFormStateValues.ProviderVitality}
                              onChange={(e) => setFieldValues("ProviderVitality", e.target.value)}
                            >
                              <option value={"0"}>Select</option>
                              <option value={"N/A"}>0 – N/A</option>
                              <option value={"Slightly"}>1 – Slightly</option>
                              <option value={"Moderately"}>2 – Moderately</option>
                              <option value={"Significantly"}>3 – Significantly</option>

                            </select>

                            {props?.dashBoardState.btnClick == "Submit" &&
                              approvalFormStateValues.ProviderVitality == "0" && (
                                <div className="errorMessage">Field is required</div>
                              )}
                          </div>
                        </div>}
                      {approvalFormStateValues.RegulatoryCompliance == "No" &&
                        <div className='col-md-4 mb-3'>
                          <label className='form-label w-100'>
                            Member Engagement
                            <span className="ReqField">*</span>
                          </label>
                          <div className="inputDiv">
                            <select
                              name="MemberEngagement"
                              className="form-control"
                              value={approvalFormStateValues.MemberEngagement}
                              onChange={(e) => setFieldValues("MemberEngagement", e.target.value)}
                            >
                              <option value={"0"}>Select</option>
                              <option value={"N/A"}>0 – N/A</option>
                              <option value={"Slightly"}>1 – Slightly</option>
                              <option value={"Moderately"}>2 – Moderately</option>
                              <option value={"Significantly"}>3 – Significantly</option>


                            </select>
                            {props?.dashBoardState.btnClick == "Submit" &&
                              approvalFormStateValues.MemberEngagement == "0" && (
                                <div className="errorMessage">Field is required</div>
                              )}
                          </div>
                        </div>}
                    </>}

                </div>
                <div className='row'>

                  {(approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" || approvalFormStateValues.status == "Pend to") &&
                    <>
                      <div className="col-md-3 mb-3">
                        <label className='form-label w-100'>
                          Level Of Complexity
                        </label>
                        <div className="inputDiv">
                          <select
                            name="LevelOfComplexity"
                            className="form-control"
                            value={approvalFormStateValues.LevelOfComplexity}
                            onChange={(e) => setFieldValues("LevelOfComplexity", e.target.value)}
                          >
                            {approvalFormStateValues?.LevelOfComplexityChoices && approvalFormStateValues?.LevelOfComplexityChoices.length == 0 ?
                              <option value={0}>Select</option>
                              :
                              approvalFormStateValues?.LevelOfComplexityChoices?.map((choice: any, index: any) => {
                                return <option value={index}>{choice}</option>
                              })
                            }
                          </select>

                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className='form-label w-100'>
                          Confidence Level
                        </label>
                        <div className="inputDiv">
                          <select
                            name="ConfidenceLevel"
                            className="form-control"
                            value={approvalFormStateValues.ConfidenceLevel}
                            onChange={(e) => setFieldValues("ConfidenceLevel", e.target.value)}
                          >
                            {approvalFormStateValues?.ConfidenceLevelChoices && approvalFormStateValues?.ConfidenceLevelChoices?.length == 0 ?
                              <option value={0}>Select</option>
                              :
                              approvalFormStateValues.ConfidenceLevelChoices?.map((choice: any, index: any) => {
                                return <option value={index}>{choice}</option>
                              })
                            }
                          </select>

                        </div>
                      </div>
                    </>}

                  {(approvalFormStateValues.status == "Sent to QM" ||
                    approvalFormStateValues.status == "Sent to QM - Hold" || approvalFormStateValues.status == "Pend to" || approvalFormStateValues.status == "Sent to Developer"
                    || approvalFormStateValues.status == "Sent to QA") &&
                    <>
                      {approvalFormStateValues.status == "Sent to Developer" || approvalFormStateValues.status == "Sent to QA" ? "" :
                        <div className='col-md-3 mb-3'>
                          <label className='form-label w-100'>
                            Report Type
                            {approvalFormStateValues.qMStatus == "Development" && <span className={approvalFormStateValues.qMStatus == "Development" && "ReqField"}>*</span>}
                          </label>
                          <div className="inputDiv">
                            <select
                              name="ReportType"
                              className="form-control"
                              value={approvalFormStateValues.ReportType}
                              onChange={(e) => setFieldValues("ReportType", e.target.value)}
                            >
                              {approvalFormStateValues?.ReportTypeChoices && approvalFormStateValues?.ReportTypeChoices?.length == 0 ?
                                <option value={0}>Select</option>
                                :
                                approvalFormStateValues.ReportTypeChoices?.map((choice: any, index: any) => {
                                  return <option value={choice}>{choice}</option>
                                })
                              }
                            </select>

                            {props?.dashBoardState.btnClick == "Submit" &&
                              approvalFormStateValues.qMStatus == "Development" &&
                              (approvalFormStateValues.ReportType == "0" || approvalFormStateValues.ReportType == "Select") && (
                                <div className="errorMessage">Field is required</div>
                              )}


                          </div>
                        </div>}
                      {(approvalFormStateValues.qaReturnToQM == "No" && approvalFormStateValues.qaReassign == "No" && approvalFormStateValues.returnToQM == "No") && <div className={approvalFormStateValues.status == "Sent to Developer" || approvalFormStateValues.status == "Sent to QA" ? "col-md-12 mb-3" : "col-md-3 mb-3"}>
                        <label className='form-label w-100'>
                          Working Month
                        </label>
                        <select
                          name="WorkingMonth"
                          className="form-control"
                          value={approvalFormStateValues.WorkingMonth}
                          onChange={(e) => setFieldValues("WorkingMonth", e.target.value)}
                        >

                          {approvalFormStateValues?.YearMonthChoices && approvalFormStateValues?.YearMonthChoices?.length == 0 ?
                            <option value={0}>Select</option>
                            :
                            approvalFormStateValues.YearMonthChoices?.map((choice: any, index: any) => {
                              return <option value={choice}>{choice}</option>
                            })
                          }

                        </select>
                      </div>}
                    </>}

                </div>
                <div className='row'>

                  {approvalFormStateValues.status == "Sent to UAT" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Approve Request Results?
                      </label>
                      <select
                        className="width97 form-control"
                        name="uatApproveRequest"
                        value={approvalFormStateValues.uatApproveRequest}
                        onChange={(e) => setFieldValues("uatApproveRequest", e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>}
                </div>

                {approvalFormStateValues.status == "Sent to QA" &&
                  approvalFormStateValues.qaReturnToQM == "No" &&
                  approvalFormStateValues.qaReassign == "No" &&
                  <div className="col-md-3 mb-3">
                    <label className='form-label w-100'>
                      {" "}
                      QA Checklist:
                    </label>
                    <div className="upload-btn-wrapper">
                      <a href="javascript:" onClick={showQALib}>
                        Click here to view QA Checklist
                      </a>
                    </div>
                  </div>}
                <div className='row'>
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Dated Notes/Comments:
                      </label>
                      <textarea
                        name="qaDatedNotes"
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.qaDatedNotes}
                        onChange={(e) => setFieldValues("qaDatedNotes", e.target.value)}
                      ></textarea>
                    </div>}
                  {((approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No")
                    ||
                    (approvalFormStateValues.status == "Sent to Developer"
                      && approvalFormStateValues.qaIssues)) && <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Issues found During QA:{" "}
                      </label>
                      <textarea
                        disabled={approvalFormStateValues.status == "Sent to Developer"}
                        name="qaIssues"
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.qaIssues}
                        onChange={(e) => setFieldValues("qaIssues", e.target.value)}
                      ></textarea>
                    </div>}
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" && <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Were there any request changes?:
                      </label>
                      <span className="boolLb1 me-3">
                        <input className='form-check-input'
                          type="radio"
                          name="devAreRequestChanges"
                          value="No"
                          checked={
                            approvalFormStateValues.devAreRequestChanges == "No"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("devAreRequestChanges", e.target.value)}
                        />
                        <span className='ms-1'>No</span>
                      </span>
                      <span>
                        <input className='form-check-input'
                          type="radio"
                          name="devAreRequestChanges"
                          value="Yes"
                          checked={
                            approvalFormStateValues.devAreRequestChanges == "Yes"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("devAreRequestChanges", e.target.value)}
                        />
                        <span className='ms-1'>Yes</span>
                      </span>
                    </div>}
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Were there any request changes?:
                      </label>
                      <span className="boolLb1 me-3">
                        <input className='form-check-input'
                          type="radio"
                          name="IsQARequestChanges"
                          value="No"
                          checked={
                            approvalFormStateValues.IsQARequestChanges == "No"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("IsQARequestChanges", e.target.value)}
                        />
                        <span className='ms-1'>No</span>
                      </span>
                      <span>
                        <input className='form-check-input'
                          type="radio"
                          name="IsQARequestChanges"
                          value="Yes"
                          checked={
                            approvalFormStateValues.IsQARequestChanges == "Yes"
                              ? true
                              : false
                          }
                          onChange={(e) => setFieldValues("IsQARequestChanges", e.target.value)}
                        />
                        <span className='ms-1'>Yes</span>
                      </span>
                    </div>}

                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" &&
                    approvalFormStateValues.devAreRequestChanges == "Yes" && <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        Dev Request Changes
                      </label>
                      <textarea
                        name="devExplain"
                        className="form-control"
                        rows={2}
                        value={approvalFormStateValues.devExplain}
                        onChange={(e) => setFieldValues("devExplain", e.target.value)}
                      ></textarea>

                    </div>}

                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    approvalFormStateValues.IsQARequestChanges == "Yes" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        QA Request Changes:
                      </label>
                      <textarea
                        name="qaRequestChanges"
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.qaRequestChanges}
                        onChange={(e) => setFieldValues("qaRequestChanges", e.target.value)}
                      ></textarea>
                    </div>}
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" &&
                    approvalFormStateValues.IsQARequestChanges == "Yes" &&
                    approvalFormStateValues.qaRequestChanges &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        QA Request Changes:
                      </label>
                      <textarea
                        name="qaRequestChanges"
                        disabled={true}
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.qaRequestChanges}
                      ></textarea>
                    </div>}
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        If QA was not completed by the Due Data explain
                      </label>
                      <textarea
                        name="qaReqNotTimely"
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.qaReqNotTimely}
                        onChange={(e) => setFieldValues("qaReqNotTimely", e.target.value)}
                      ></textarea>
                    </div>}
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        If request was not completed by due date explain?
                      </label>
                      <textarea
                        name="devReqExplanation"
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.devReqExplanation}
                        onChange={(e) => setFieldValues("devReqExplanation", e.target.value)}
                      ></textarea>
                    </div>}
                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    approvalFormStateValues.devAreRequestChanges == "Yes" &&
                    approvalFormStateValues.devAreRequestChanges && <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        Dev Request Changes:
                      </label>
                      <textarea
                        name="devExplain"
                        disabled={true}
                        className="form-control"
                        rows={2}
                        value={approvalFormStateValues.devExplain}
                        onChange={(e) => setFieldValues("devExplain", e.target.value)}
                      ></textarea>
                    </div>}

                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" && <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Dated Notes/Issues:
                      </label>
                      <textarea
                        name="devDatedNotes"
                        className="width97 form-control"
                        rows={2}
                        value={approvalFormStateValues.devDatedNotes}
                        onChange={(e) => setFieldValues("devDatedNotes", e.target.value)}
                      ></textarea>
                    </div>}

                </div>





                {/****************End formating *********** */}


                {/* \rest not formating beacuse  in excel not mention  */}
                <div className='row'>


                  {approvalFormStateValues.status ==
                    "Sent For Department Approval" &&
                    <div className='col-md-6 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Request Approved
                      </label>
                      <select
                        name="vpApproved"
                        className="form-control"
                        value={approvalFormStateValues.vpApproved}
                        onChange={(e) => setFieldValues("vpApproved", e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>}
                  {(approvalFormStateValues.status == "Sent to Developer" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Design" ||
                    approvalFormStateValues.status ==
                    "Sent to Developer - Development") &&
                    approvalFormStateValues.returnToQM == "No" &&
                    <>
                      {/* Developer form change Hiding the below dates as shown above section */}
                      <div className="col-md-6 mb-3 MRT-25" style={{ display: "none" }}>
                        <label className='form-label w-100'>
                          {" "}
                          Follow-up:
                        </label>
                        <input
                          type="text"
                          name="devFollowUp"
                          className="form-control"
                          value={approvalFormStateValues.devFollowUp}
                          onChange={(e) => setFieldValues("devFollowUp", e.target.value)}
                        ></input>
                      </div>
                    </>}

                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&

                    <div className="col-md-6 mb-3" style={{ display: "none" }}>
                      <label className='form-label w-100'>
                        {" "}
                        Follow-up:
                      </label>
                      <input
                        type="text"
                        name="qaFollowUp"
                        className="width97 form-control"
                        value={approvalFormStateValues.qaFollowUp}
                        onChange={(e) => setFieldValues("qaFollowUp", e.target.value)}
                      ></input>
                    </div>
                  }

                  {approvalFormStateValues.status == "Sent to QA" &&
                    approvalFormStateValues.qaReturnToQM == "No" &&
                    approvalFormStateValues.qaReassign == "No" &&
                    <div style={{ display: "none" }}>

                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}
                          Attached preliminary/final output:
                        </label>
                        <div className="upload-btn-wrapper">
                          <a href="javascript:" onClick={showLib}>
                            Click here to Upload
                          </a>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className='form-label w-100'>
                          {" "}

                          {" "}
                          Link or location to the final report including code and
                          QA:

                        </label>
                        <div className="upload-btn-wrapper">
                          <a href="javascript:" onClick={showLib}>
                            Click here to Upload/DS Link
                          </a>
                        </div>
                      </div>

                    </div>}

                  {approvalFormStateValues.status == "Governance Hold" &&
                    <div className='col-md-6 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Is Governance requirement completed?
                      </label>
                      <select
                        name="isGovernanceCompleted"
                        className="width97"
                        value={approvalFormStateValues.isGovernanceCompleted}
                        onChange={(e) => setFieldValues("isGovernanceCompleted", e.target.value)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>}

                  {approvalFormStateValues.status == "Sent to UAT" &&
                    approvalFormStateValues.uatApproveRequest == "Yes" &&
                    <div className={approvalFormStateValues.uatApproveRequest == "Yes" ? "surveySection mb-3" : "mb-3"}>
                      <div className=" dvSurvey">
                        <label className='form-label'>Please take our 10 second feedback survey to help us improve!</label>

                        <div>
                          Overall satisfaction with end to end Request Process?
                          <br />
                          <div>
                            The Business Requestor is the person for whom the Request will be created  Please rate on a cale of 1-5 where 1 is very dissatisfied and 5 is very satisfied.
                            <span className="ReqField">*</span>
                          </div>
                        </div>
                      </div>
                      <div className="dvSurvey">

                        <div className="col-md-12 mb-3 questionChoice">
                          <select
                            className="form-control"
                            name="overallSatisfaction"
                            value={approvalFormStateValues.overallSatisfaction}
                            onChange={(e) => setFieldValues("overallSatisfaction", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                      <div className="dvSurvey col-md-12 mb-3">
                        <label className='form-label w-100'>
                          Did the results met clients expectations?{" "}
                          <span className="ReqField">*</span>
                        </label>
                        <div className="questionChoice">
                          <select
                            className="form-control"
                            name="metExpectations"
                            value={approvalFormStateValues.metExpectations}
                            onChange={(e) => setFieldValues("metExpectations", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
                      <div className="dvSurvey col-md-12 mb-3">
                        <label className='form-label w-100'>
                          Was your request completed timely and accurately?{" "}
                          <span className="ReqField">*</span>
                        </label>
                        <div className="questionChoice">
                          <select
                            className="form-control"
                            name="reqCompletedTimely"
                            value={approvalFormStateValues.reqCompletedTimely}
                            onChange={(e) => setFieldValues("reqCompletedTimely", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
                      <div className="dvSurvey col-md-12 mb-3">
                        <label className='form-label w-100'>Please provide any other survey comments</label>
                        <div className="questionChoice">
                          <textarea
                            className="form-control"
                            rows={4}
                            name="surveyComments"
                            value={approvalFormStateValues.surveyComments}
                            onChange={(e) => setFieldValues("surveyComments", e.target.value)}
                          ></textarea>
                        </div>
                      </div>

                      {approvalFormStateValues.status == "Sent to UAT" &&
                        approvalFormStateValues.uatApproveRequest == "Yes" &&
                        (approvalFormStateValues.overallSatisfaction.length ==
                          0 ||
                          approvalFormStateValues.reqCompletedTimely.length ==
                          0 ||
                          approvalFormStateValues.metExpectations.length ==
                          0) && (
                          <div className="errorMessage">Please fill out survey</div>
                        )}
                    </div>}
                </div>




                <div className='row'>
                  <div className='col-md-12 mb-3'>
                    <label className='form-label w-100'>
                      {" "}
                      Comments:
                    </label>
                    <textarea
                      name="comments"
                      className="w-100 form-control"
                      rows={2}
                      value={approvalFormStateValues.comments}
                      onChange={(e) => setFieldValues("comments", e.target.value)}
                    ></textarea>
                  </div>
                  {approvalFormStateValues.status !=
                    "Sent For Department Approval" &&
                    <div className='col-md-12 mb-3'>
                      <label className='form-label w-100'>
                        {" "}
                        Previous Comments:
                      </label>
                      <div className='commentSection'>
                        <div dangerouslySetInnerHTML={{ __html: approvalFormStateValues.prevComments }}></div>
                      </div>
                    </div>}
                </div>

              </div>

            </div>
            <footer className="fixed-bottom panel-footer">
              {approvalFormStateValues.status === "Sent to Manager PHI-PII" ||
                approvalFormStateValues.status === "Sent to Manager Sensitive" ||
                approvalFormStateValues.status === "Sent to VP" ||
                approvalFormStateValues.status === "Sent to IRO" && <button className="btn btn-primary" onClick={approveForm} type="button">Approve</button>}
              {approvalFormStateValues.status === "Sent to Manager PHI-PII" ||
                approvalFormStateValues.status === "Sent to Manager Sensitive" ||
                approvalFormStateValues.status === "Sent to VP" ||
                approvalFormStateValues.status === "Sent to IRO" && <button className="btn btn-danger" onClick={rejectForm} type="button">Reject</button>}
              <button className="btn btn-secondary" onClick={closeForm} type="button">Cancel</button>
              {(approvalFormStateValues.status === "Sent to Manager PHI-PII" ||
                approvalFormStateValues.status === "Sent to Manager Sensitive" ||
                approvalFormStateValues.status === "Sent to VP" ||
                approvalFormStateValues.status === "Sent to IRO") ? "" : <button className="btn btn-primary" onClick={submitForm} type="button">Submit</button>}
            </footer>
          </div> : <div>
            <Placeholder.Paragraph rows={8} />
            <Loader center content="loading" />
          </div>

        }

        {props?.dashBoardState.hideDialog == false && (
          <CustomModal
            title="Approval Form"
            message=
            "Required fields are missing. All fields with (*) must be populated."
            buttonOneText="Ok"
            onButtonOneClick={() => handleButtonActions("Ok")}
          />
        )}
      </Panel>


    </div>
  );
};

export default ApprovalForm;