import { useState, useEffect } from 'react';
import * as React from 'react';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "sp-pnp-js";
import * as util from '../../../Util';
import { LogLevel } from '@pnp/logging';
import { FaExclamationCircle } from "react-icons/fa";
import { RiFileExcel2Line, RiVipDiamondLine } from "react-icons/ri";
import { LuFilter, LuFilterX } from "react-icons/lu";
import { MdOutlineRefresh } from "react-icons/md";
import { IoDocumentOutline } from "react-icons/io5";
// import { TbReport } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import "datatables.net";
import { DetailsList, IColumn, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import "@fluentui/react/dist/css/fabric.min.css";
import { Link } from 'office-ui-fabric-react';
import * as moment from "moment";
import PageLoader from '../../../GlobalComponent/PageLoader';
import ApprovalForm from './ApprovalForm';
import '../../../GlobalComponent/style.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import FilterComponent from './SmartFilter';
let copysiteGroups: any = []
let copyConfigpermission: any = []
let ManagerGroupId: any;
const DashboardProfile = (props: any) => {
  const [activeKey, setActiveKey] = useState(props?.props?.tab1Title);
  const [globalSearchTitle, setGlobalSearchTitle] = useState("");
  const [configpermission, setConfigPermission] = useState({
    AdminGrpId: "", QMGrpId: "",
    GovernanceGrpId: "", PHIPLLGroupId: "", SensitiveGroupId: "", VIPMessage: "",
    HasVIPAccessMessage: "", PHIPIIMessage: "", SensitiveMessage: "", QAChecklist: ""
  })
  const [state, setState] = useState<any>({
    requests: [],
    currentUser: {
      Id: props?.props?.context.pageContext._legacyPageContext.userId,
      Title: props?.props?.context.pageContext._legacyPageContext?.userDisplayName,
      Email: props?.props?.context.pageContext._legacyPageContext?.userEmail
    },
    page: 1,
    hideDialog: true,
    formSubmitted: false,
    reqNo: '',
    requestFormUrl: props?.props?.newRequestUrl,
    editRequestUrl: props?.porops?.editRequestUrl,
    ItemId: '',
    itemInfo: [],
    documentUrl: '',
    status: '',
    userGroups: [],
    siteGroups: [],
    isAdmin: false,
    isQM: false,
    newRequestUrl: props?.props?.newRequestUrl,
    documentSetLibTitle: props?.props?.documentSetLibTitle,
    relativeUrl: '',
    siteUrl: '',
    tabClicked: '1',
    btnClick: '',
    itemCount: 1,
    IsManager: false
  });
  const [dissabled, setDissabled] = useState(false);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [CreatedRequests, setCreatedRequests]: any = useState()
  const [AssignedRequests, setAssignedRequests]: any = useState()
  const [managerRequest, setManagerRequest]: any = useState([])
  const [approvalData, setApprovalData]: any = useState()
  const [OpenApprovalPopup, setOpenApprovalPopup]: any = useState(false)
  const [openSmartFilter, setOpenSmartFilter]: any = useState(false)
  const [smartFilterData, setSmartFilterData]: any = useState([])
  const [filters, setFilters]: any = useState({});
  const web = new Web(props?.props?.siteUrl);
  useEffect(() => {
    setActiveKey(props?.props?.tab1Title)
    getConfigValues();
    getLoggedInUserDetails();
    getAllSiteGroups();

    setState((prevState: any) => ({
      ...prevState,
      newRequestUrl: props?.props?.newRequestUrl,
      itemCount: props?.props?.itemCount,
      documentSetLibTitle: props?.props?.documentSetLibTitle,
      siteUrl: props?.props?.siteUrl,
      surveyListTitle: props?.props?.surveyListTitle,
    }));
  }, [props]);


  const getLoggedInUserDetails = async () => {
    try {
      const currentUser = await web.currentUser.get();
      setState((prevState: any) => ({
        ...prevState,
        currentUser,
      }));
      getLoggedInUserGroups(currentUser.Id);
    } catch (error) {
      util.writeErrorLog('DashboardProfile.tsx', 'getLoggedInUserDetails', error.status.toString(), LogLevel.Error, error.message);
    }
  };

  const getLoggedInUserGroups = async (userId: any) => {
    try {
      const userGroups = await web.getUserById(userId).groups.get();
      setState((prevState: any) => ({
        ...prevState,
        userGroups,
      }));
      const adminGrp = userGroups.filter((x: any) => x.Id == copyConfigpermission?.AdminGrpId);
      const qmGrp = userGroups.filter((x: any) => x.Id == copyConfigpermission?.QMGrpId);
      ManagerGroupId = userGroups.filter((x: any) => x.Id == copyConfigpermission?.ManagerGroupId);
      if (ManagerGroupId?.length > 0) {
        ManagerGroupId[0].userId = userId
      }
      if (adminGrp.length > 0) {
        setState((prevState: any) => ({
          ...prevState,
          IsManager: ManagerGroupId?.length > 0 ? true : false,
          isAdmin: true,
        }));
      }
      if (qmGrp.length > 0) {
        setState((prevState: any) => ({
          ...prevState,
          IsManager: ManagerGroupId?.length > 0 ? true : false,
          isQM: true,
        }));
      }
      getRequests();
    } catch (error) {
      util.writeErrorLog('DashboardProfile.tsx', 'getLoggedInUserGroups', error.status.toString(), LogLevel.Error, error.message);
    }
  }

  const getConfigValues = async () => {
    try {
      const configItems = await web.lists.getByTitle(props?.props?.configList).items.get();
      let object = {
        AdminGrpId: "", QMGrpId: "",
        GovernanceGrpId: "", PHIPLLGroupId: "", SensitiveGroupId: "", VIPMessage: "",
        HasVIPAccessMessage: "", PHIPIIMessage: "", SensitiveMessage: "", QAChecklist: "",
        ManagerGroupId: 0
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
          case 'PHIPLL GroupId':
            object.PHIPLLGroupId = item.Value
            break;
          case 'Sensitive GroupId':
            object.SensitiveGroupId = item.Value
            break;
          case 'VIP Message':
            object.VIPMessage = item.Value
            break;
          case 'Has VIP Access Message':
            object.HasVIPAccessMessage = item.Value
            break;
          case 'PHIPII Message':
            object.PHIPIIMessage = item.Value
            break;
          case 'Sensitive Message':
            object.SensitiveMessage = item.Value
            break;
          case 'QA Checklist':
            object.QAChecklist = item.Value
            break;
          case 'Manager GroupId':
            object.ManagerGroupId = item.Value
            break;
          default:
            break;

        }
      });
      copyConfigpermission = object;
      setConfigPermission(object);
    } catch (error) {
      util.writeErrorLog("DashboardProfile.tsx", "getConfigValues", error.status.toString(), LogLevel.Error, error.responseText);
      console.log(error)
    }
  };

  const getAllSiteGroups = async () => {
    try {
      const siteGroups = await web.siteGroups.get();
      setState((prevState: any) => ({
        ...prevState,
        siteGroups,
      }));
      copysiteGroups = siteGroups
    } catch (error) {
      util.writeErrorLog('DashboardProfile.tsx', 'getAllSiteGroups', error.status.toString(), LogLevel.Error, error.message);
    }
  };

  const getRequests = async () => {
    try {
      // First batch call - small number
      const batchRequests = await web.lists.getByTitle('Requests').items
        .select('Modified,DeveloperPriority,DeveloperDueDate,BusinessValueScore,RequestPriority,Id,AuthorId,Request_x0020_Due_x0020_Date,RequestName,NegotiatedDueDate,Dev_x0020_Negotiated_x0020_Due_x,QA_x0020_Negotiated_x0020_Due_x0,Priority_x0020_Normal_x0020_or_x,Report_x0020_Name,IsActionDisabled,Assigned_x0020_To/EMail,Assigned_x0020_To/FirstName,Assigned_x0020_To/LastName,Business_x0020_Requestor/EMail,Business_x0020_Requestor/FirstName,Business_x0020_Requestor/LastName,Department/Title,DevelopmentManager/FirstName,DevelopmentManager/LastName,DevelopmentManager/Id,Assigned_x0020_To/Id,Approval_x0020_Needed_x003f_,Status,Request_x0020_No,Developer_x0020_Resource/FirstName,Developer_x0020_Resource/LastName,QA_x0020_Resource/FirstName,QA_x0020_Resource/LastName')
        .expand('Assigned_x0020_To,Business_x0020_Requestor,QA_x0020_Resource,Developer_x0020_Resource,DevelopmentManager,Department')
        .orderBy('Modified', false)
        .top(50) // Fetch only 50 items initially
        .get();

      // Process and show initial batch
      processRequests(batchRequests);


      // Then in background fetch full data
      const fullRequests = await web.lists.getByTitle('Requests').items
        .select('Modified,DeveloperPriority,DeveloperDueDate,BusinessValueScore,RequestPriority,Id,AuthorId,Request_x0020_Due_x0020_Date,RequestName,NegotiatedDueDate,Dev_x0020_Negotiated_x0020_Due_x,QA_x0020_Negotiated_x0020_Due_x0,Priority_x0020_Normal_x0020_or_x,Report_x0020_Name,IsActionDisabled,Assigned_x0020_To/EMail,Assigned_x0020_To/FirstName,Assigned_x0020_To/LastName,Business_x0020_Requestor/EMail,Business_x0020_Requestor/FirstName,Business_x0020_Requestor/LastName,Department/Title,DevelopmentManager/FirstName,DevelopmentManager/LastName,DevelopmentManager/Id,Assigned_x0020_To/Id,Approval_x0020_Needed_x003f_,Status,Request_x0020_No,Developer_x0020_Resource/FirstName,Developer_x0020_Resource/LastName,QA_x0020_Resource/FirstName,QA_x0020_Resource/LastName')
        .expand('Assigned_x0020_To,Business_x0020_Requestor,QA_x0020_Resource,Developer_x0020_Resource,DevelopmentManager,Department')
        .orderBy('Modified', false)
        .getAll(); // Full fetch

      processRequests(fullRequests);


    } catch (error: any) {
      util.writeErrorLog("DashboardProfile.tsx", "getRequests", error.status.toString(), LogLevel.Error, error.responseText);
      console.log(error)
    }
  };

  const processRequests = (requests: any[]) => {
    let check: any = ["Sent to QM", "Sent to QM - Hold"]
    const updatedResults: any = []
    let managerRequest: any = []
    requests?.map((data: any) => {
      const item = { ...data };
      
      item.RequestPriority = data?.RequestPriority ?? "";
      item.BusinessValueScore = data?.BusinessValueScore ?? "";
      item.Assigned_x0020_ToId = data?.Assigned_x0020_To?.Id ?? null;
      item.Department = data?.Department?.Title ?? "";
      item.NegotiatedDueDate = moment(data?.NegotiatedDueDate).format("MM/DD/YYYY");
      item.Request_x0020_Due_x0020_Date = moment(data?.Request_x0020_Due_x0020_Date).format("MM/DD/YYYY");
      // item.DeveloperDueDate = moment(data?.DeveloperDueDate).format("MM/DD/YYYY");
      //  item.DeveloperPriority = data?.DeveloperPriority ?? "";
      item.Business_x0020_Requestor =
        `${data?.Business_x0020_Requestor?.FirstName ?? ""} ${data?.Business_x0020_Requestor?.LastName ?? ""}`.trim();
      item.Developer_x0020_Resource =
        `${data?.Developer_x0020_Resource?.FirstName ?? ""} ${data?.Developer_x0020_Resource?.LastName ?? ""}`.trim();
      item.QA_x0020_Resource =
        `${data?.QA_x0020_Resource?.FirstName ?? ""} ${data?.QA_x0020_Resource?.LastName ?? ""}`.trim();

      // Assigned To handling
      if (data.Assigned_x0020_To == null) {
        item.Assigned_x0020_To = "";
      } if (check.includes(item.Status)) {
        item.Assigned_x0020_To = "Queue Manager";
      } else if (item.Status === "Governance Hold") {
        item.Assigned_x0020_To = "Governance";
      } else if (item.Status === "Sent to IRO") {
        const isGroup = copysiteGroups.filter((x: any) => x.Id === item.Assigned_x0020_To.Id);
        if (isGroup) {
          item.Assigned_x0020_To = isGroup[0].Title;
        }
      } else {
        item.Assigned_x0020_To = `${item.Assigned_x0020_To.FirstName || ""} ${item.Assigned_x0020_To.LastName || ""}`;
      }
      if (ManagerGroupId?.length > 0) {

        if (item?.DevelopmentManager?.Id == ManagerGroupId[0]?.userId) {
          managerRequest?.push(item)
        }
      }
      item.DevelopmentManager =
        `${data?.DevelopmentManager?.FirstName ?? ""} ${data?.DevelopmentManager?.LastName ?? ""}`.trim();
      updatedResults?.push(item);
    });

    updatedResults.sort((a: any, b: any) => {
    const aDate = new Date(a.Modified);
    const bDate = new Date(b.Modified);
    return bDate.getTime() - aDate.getTime();
  });
    const allRequests = updatedResults;
    const createdRequests = allRequests.filter((x: any) => x.AuthorId === state?.currentUser.Id);
    const assignedRequests = allRequests.filter((x: any) =>
      x.Assigned_x0020_ToId === state?.currentUser.Id ||
      (check.includes(x.Status) && state?.isQM) ||
      (x.Status === "Governance Hold" && state?.isAdmin)
    );
   
    if (globalSearchTitle?.length > 1) {
      const filteredData = allRequests.filter((item: any) =>
        columns.some((col: any) => {
          const field: any = item[col.fieldName];
          return (
            field &&
            typeof field === "string" &&
            field.toLowerCase().includes(globalSearchTitle)
          );
        })
      );
      setSortedItems(filteredData)
      setAllRequests(allRequests);
      setCreatedRequests(createdRequests);
      setAssignedRequests(assignedRequests);
      setManagerRequest(managerRequest)
    } else {
      setAllRequests(allRequests);
      setCreatedRequests(createdRequests);
      setAssignedRequests(assignedRequests);
      setSortedItems(updatedResults)
      setManagerRequest(managerRequest)
    }



  };


  // new table design code
  const [sortedItems, setSortedItems] = useState(allRequests);
  const [isSortedDescending, setIsSortedDescending] = useState(false);
  const [column, setColumn] = useState<IColumn | undefined>(undefined);
  const headerStyle = {
    cellTitle: {
      color: "#FFF",
      background: "#A4262C",
      border: "8px"
    }
  };
  const columns: IColumn[] = [
    {
      styles: headerStyle,
      key: 'column1',
      name: 'Request No',
      fieldName: 'Request_x0020_No',
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: column?.key === 'column1' ? true : false,
      isSortedDescending: column?.key === 'column1' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),

    },
    {
      styles: headerStyle,
      key: 'column2',
      name: 'Request Name',
      fieldName: 'RequestName',
      minWidth: 200,
      maxWidth: 250,
      isSorted: column?.key === 'column2' ? true : false,
      isSortedDescending: column?.key === 'column2' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column3',
      name: 'Due Date',
      fieldName: 'Request_x0020_Due_x0020_Date',
      minWidth: 100,
      maxWidth: 100,
      isSorted: column?.key === 'column3' ? true : false,
      isSortedDescending: column?.key === 'column3' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    //  {
    //   styles: headerStyle,
    //   key: 'column3',
    //   name: 'Developer Due Date',
    //   fieldName: 'DeveloperDueDate',
    //   minWidth: 100,
    //   maxWidth: 100,
    //   isSorted: column?.key === 'column3' ? true : false,
    //   isSortedDescending: column?.key === 'column3' ? isSortedDescending : false,
    //   onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    // },
    {
      styles: headerStyle,
      key: 'column4',
      name: 'Business Priority',
      fieldName: 'BusinessValueScore',
      minWidth: 100,
      maxWidth: 100,
      isSorted: column?.key === 'column4' ? true : false,
      isSortedDescending: column?.key === 'column4' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    //  {
    //   styles: headerStyle,
    //   key: 'column4',
    //   name: 'Developer Priority',
    //   fieldName: 'DeveloperPriority',
    //   minWidth: 100,
    //   maxWidth: 100,
    //   isSorted: column?.key === 'column4' ? true : false,
    //   isSortedDescending: column?.key === 'column4' ? isSortedDescending : false,
    //   onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    // },
    {
      styles: headerStyle,
      key: 'column5',
      name: 'Business Requestor',
      fieldName: 'Business_x0020_Requestor',
      minWidth: 100,
      maxWidth: 100,
      isSorted: column?.key === 'column5' ? true : false,
      isSortedDescending: column?.key === 'column5' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column6',
      name: "Requestor's Department",
      fieldName: 'Department',
      minWidth: 100,
      maxWidth: 100,
      isSorted: column?.key === 'column6' ? true : false,
      isSortedDescending: column?.key === 'column6' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column7',
      name: 'Dev Name',
      fieldName: 'Developer_x0020_Resource',
      minWidth: 105,
      maxWidth: 105,
      isSorted: column?.key === 'column7' ? true : false,
      isSortedDescending: column?.key === 'column7' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column8',
      name: 'Dev Manager Name',
      fieldName: 'DevelopmentManager',
      minWidth: 150,
      maxWidth: 200,
      isSorted: column?.key === 'column8' ? true : false,
      isSortedDescending: column?.key === 'column8' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column9',
      name: 'QA Name',
      fieldName: 'QA_x0020_Resource',
      minWidth: 100,
      maxWidth: 100,
      isSorted: column?.key === 'column9' ? true : false,
      isSortedDescending: column?.key === 'column9' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column10',
      name: 'Assigned To',
      fieldName: 'Assigned_x0020_To',
      minWidth: 110,
      maxWidth: 110,
      isSorted: column?.key === 'column10' ? true : false,
      isSortedDescending: column?.key === 'column10' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column11',
      name: 'Status',
      fieldName: 'Status',
      minWidth: 100,
      maxWidth: 100,
      isSorted: column?.key === 'column11' ? true : false,
      isSortedDescending: column?.key === 'column11' ? isSortedDescending : false,
      onColumnClick: (ev, col) => onColumnHeaderClick(ev, col),
    },
    {
      styles: headerStyle,
      key: 'column12',
      name: 'Action',
      minWidth: 60,
      maxWidth: 60,
      onRender: (item) => (
        <div className='approveButton'>
          <button className='btn btn-primary' disabled={item?.Status == "Completed" || item?.Status === "Cancelled" ? true : false} onClick={() => handleApprove(item)}>Action</button>
        </div>
      ),
    },
  ];
  const reloadData = () => {
    setApprovalData()
    console.log("submitted");
    getRequests();
  }
  const handleApprove = (item: any) => {
    console.log('Approve item:', item);
    setOpenApprovalPopup(true)
    setApprovalData(item)
  };
 

  const onColumnHeaderClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
    const isCurrentlySorted = column.isSorted;
    const newIsSortedDescending = isCurrentlySorted ? !column.isSortedDescending : false;
    const sortedData = sortedItems.slice().sort((a, b) => {
      const aValue = a[column.fieldName as keyof typeof a] ?? '';
      const bValue = b[column.fieldName as keyof typeof b] ?? '';

      // Ensure numerical sorting for Request_x0020_No
      if (column.fieldName === 'Request_x0020_No') {
        const aNum = parseInt(aValue, 10);
        const bNum = parseInt(bValue, 10);
        return newIsSortedDescending ? bNum - aNum : aNum - bNum;
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return newIsSortedDescending ? -comparison : comparison;
    });

    setSortedItems(sortedData);
    setIsSortedDescending(newIsSortedDescending);
    setColumn({
      ...column,
      isSorted: true,
      isSortedDescending: newIsSortedDescending,
    });
  };
  const renderItemColumn = (item: any, index: any, column: any) => {
    const fieldContent = item[column.fieldName];
    switch (column.key) {
      case "column1":
        return (
          <span>
            <Link href={`${props?.props?.editRequestUrl}?ItemId=${item?.Id}&PageMode=View`} target='_blank' data-interception="off">
              {fieldContent}
            </Link>
          </span>
        );
      case "column3":
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{fieldContent}</span>
            {item?.RequestPriority === "Urgent" && (
              <span className='siteColor'><FaExclamationCircle /></span>
            )}
          </div>
        );
      default:
        return <span>{fieldContent}</span>;
    }
  };
  const onTabClick = (tabValue: any) => {
    console.log(tabValue)
    setActiveKey(tabValue);
    setFilters({});
    setSmartFilterData([]);

    if (tabValue == props?.props?.tab1Title) {
      setSortedItems(allRequests)
    }
    else if (tabValue == props?.props?.tab2Title) {
      setSortedItems(CreatedRequests)
    }
    else if (tabValue == props?.props?.tab3Title) {
      setSortedItems(AssignedRequests)
    }
    else if (tabValue == props?.props?.tab4Title) {
      setSortedItems(managerRequest)
    }
    else {
      setSortedItems([])
    }

  }



  const handleSearch = (event: any) => {
  const value = event.target.value.toLowerCase();
  setGlobalSearchTitle(value);

  // Decide which dataset to search based on the active tab
  let baseData: any[] = [];
  if (activeKey == props?.props?.tab1Title) {
    baseData = allRequests;
  } else if (activeKey == props?.props?.tab2Title) {
    baseData = CreatedRequests;
  } else if (activeKey == props?.props?.tab3Title) {
    baseData = AssignedRequests;
  } else if (activeKey == props?.props?.tab4Title) {
    baseData = managerRequest;
  }

  if (value.trim() === "") {
    setDissabled(false);
    setSortedItems(baseData);
    return;
  }

  const filteredData = baseData.filter((item) =>
    columns.some((col: any) => {
      const field: any = item[col.fieldName];
      return (
        field &&
        typeof field === "string" &&
        field.toLowerCase().includes(value)
      );
    })
  );
  setDissabled(filteredData?.length === 0);
  setSortedItems(filteredData);
};

  return (
    <div id='requestDashboard'>
      <div className='flexMiddle justify-content-between mb-3'>
        <h2 className='siteColor'>Request Dashboard</h2>
        <div className='iconSection'>
          <a href="#" className={dissabled?'fiterIcon hyperlink disabled ':"fiterIcon hyperlink "} title='Open the filters' onClick={() => {if (!dissabled) setOpenSmartFilter(true)}}><LuFilter /></a>
          <a href="#" className={`clearFiterIcon hyperlink ${Object.keys(filters).length === 0 && smartFilterData.length === 0 ? 'disabled' : ''}`}
            title='Clear the filters' 
            onClick={(e) => {
              e.preventDefault();
              if (Object.keys(filters).length > 0 || smartFilterData.length > 0) {
                setFilters({});
                setSmartFilterData([]);
                if (activeKey === props?.props?.tab1Title) {
                  setSortedItems(allRequests);
                } else if (activeKey === props?.props?.tab2Title) {
                  setSortedItems(CreatedRequests);
                } else if (activeKey === props?.props?.tab3Title) {
                  setSortedItems(AssignedRequests);
                } else if (activeKey === props?.props?.tab4Title) {
                  setSortedItems(managerRequest);
                }
              }
            }}
          >
            <LuFilterX />
          </a>
          <a href="#" className='excelIcon hyperlink ' title='Export to Excel'><RiFileExcel2Line /></a>
          <a href="#" className='refreshIcon hyperlink ' title='Refresh' onClick={() => reloadData()}><MdOutlineRefresh /></a>
          <a href="#" className='reportIcon hyperlink ' title='Report'><IoDocumentOutline /></a>
          <a href="#" className='vipAcessIcon hyperlink ' title='VIP Access List'><RiVipDiamondLine /></a>
        </div>

      </div>
      <div className='tabIconSection mb-3'>
        {(props?.props?.Disbledtab ?? true) && ( <div className='iconSection'>
          <span className={dissabled?'fiterIcon hyperlink disabled ':"fiterIcon hyperlink "}onClick={() => {if (!dissabled) setOpenSmartFilter(true)}}><div className='iconBase'><LuFilter /></div><span>Open the filters</span></span>
          <span className='excelIcon hyperlink '><div className='iconBase'><RiFileExcel2Line /></div><span>Export to Excel</span></span>
          <span className='refreshIcon hyperlink ' onClick={() => reloadData()}><div className='iconBase'><MdOutlineRefresh /></div><span>Refresh</span></span>
          <span className='reportIcon hyperlink '><div className='iconBase'><IoDocumentOutline /></div><span>Report</span></span>
          <span className='vipAcessIcon hyperlink '><div className='iconBase'><RiVipDiamondLine /></div><span>VIP Access List</span></span>
        </div>)}
        </div>
      <div className={state.isLoading ? 'formOpacity tabs tabs-style-iconbox' : 'tabs tabs-style-iconbox'}>
        <ul className="nav nav-fill nav-tabs customTabs gap-3" role="tablist">
          <li className="nav-item" role="presentation">
            <a className={`nav-link ${activeKey == props?.props?.tab1Title && 'active'}`} id="fill-tab-0" data-bs-toggle="tab" href="#fill-tabpanel-0" role="tab" aria-controls="fill-tabpanel-0" aria-selected="true" onClick={() => onTabClick(props?.props?.tab1Title)}>{props?.props?.tab1Title}</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className={`nav-link ${activeKey == props?.props?.tab2Title && 'active'}`} id="fill-tab-1" data-bs-toggle="tab" href="#fill-tabpanel-1" role="tab" aria-controls="fill-tabpanel-1" aria-selected="false" onClick={() => onTabClick(props?.props?.tab2Title)}>{props?.props?.tab2Title}</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className={`nav-link ${activeKey == props?.props?.tab3Title && 'active'}`} id="fill-tab-2" data-bs-toggle="tab" href="#fill-tabpanel-2" role="tab" aria-controls="fill-tabpanel-2" aria-selected="false" onClick={() => onTabClick(props?.props?.tab3Title)}>{props?.props?.tab3Title}</a>
          </li>
          {state?.IsManager && <li className="nav-item" role="presentation">
            <a className={`nav-link ${activeKey == props?.props?.tab4Title && 'active'}`} id="fill-tab-3" data-bs-toggle="tab" href="#fill-tabpanel-2" role="tab" aria-controls="fill-tabpanel-2" aria-selected="false" onClick={() => onTabClick(props?.props?.tab4Title)}>{props?.props?.tab4Title}</a>
          </li>}
        </ul>
        <div className="tab-content pt-2" id="tab-content">
          <div className='tableHeaderSection'>
            {/* <div className='showData'>Show All Items Here </div> */}
            <div className='searchField'><input className='form-control' placeholder='Search here...' onChange={(e) => handleSearch(e)} /></div>
            <div className='allIconSection'>

              <div className='iconSection'> <span className='approveButton'><button className='btn btn-primary' onClick={() => window.open(props?.props?.RequestUrl, "_blank")}><GoPlus /> New Request</button></span></div>
            </div>
          </div>
          <div className='customTableDesign'>
            {state?.isLoading ? <PageLoader /> : null}
            <div style={{ position: 'relative' }}>

              {(sortedItems?.length === 0 && allRequests?.length > 0) || (Object.keys(filters)?.length > 0 && smartFilterData?.length == 0) ? (
                <div style={{
                  position: 'absolute',
                  top: '72%',
                  left: '50%',
                  transform: 'translate(-50%, 50%)',
                  padding: '45px 10px 10px 10px;',
                  zIndex: 1
                }}>
                  No data available
                </div>
              ) : <DetailsList
                items={Object.keys(filters)?.length > 0 ? smartFilterData : sortedItems}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionMode={0}
                onRenderItemColumn={renderItemColumn}
              />}
            </div>
          </div>
        </div>


      </div>

      {OpenApprovalPopup && <ApprovalForm
        spHttpClient={props?.props?.spHttpClient}
        props={props?.props}
        approvalData={approvalData}
        reloadData={reloadData}
        dashBoardState={state}
        setState={setState}
        configpermission={configpermission}
        setOpenApprovalPopup={setOpenApprovalPopup}
        OpenApprovalPopup={OpenApprovalPopup}
      ></ApprovalForm>}
      {openSmartFilter && <FilterComponent data={sortedItems} columns={columns}
        openSmartFilter={openSmartFilter} setOpenSmartFilter={setOpenSmartFilter}
        onTabClick={onTabClick} activeKey={activeKey}
        setSmartFilterData={setSmartFilterData}
        smartFilterData={smartFilterData} setFilters={setFilters} filters={filters} />}
    </div>
  );

};

export default DashboardProfile;
