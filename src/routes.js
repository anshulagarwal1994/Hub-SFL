import LoginPage from "views/Pages/LoginPage.js";
import SalesLeadsRedirectPage from "views/Pages/SalesLeadsRedirectPage.js";
import RedirectToMyShipment from "views/Pages/RedirectToMyShipment.js";
import RegisterPage from "views/Pages/signup.js";
import ProfilePage from "views/Pages/ProfilePage";
import ForgotpasswordPage from "views/Pages/ForgotpasswordPage.js";
import ResetPassword from "views/Pages/ResetPassword";
import Scheduleshipment from "components/Scheduleshipment/Scheduleshipment.js";
// import Scheduleshipment from "components/ScheduleShipmentNew/Scheduleshipment.js";
// import Scheduleshipmentnew from "components/Scheduleshipment/Scheduleshipmentnew.js";
import UserList from "components/Management/UserList";
// import AddUser from "components/Management/Adduser";
import AddUserNew from "components/Management/AddUserNew";
import VendorSearch from "components/Management/VendorSearch";
import Vendor from "components/Management/Vendor/Vendor";
import EditVendor from "components/Management/EditVendor";
import ContactUs from "components/WebForms/ContactUs";
import CallBack from "components/WebForms/CallBack";
import AddaClaim from "components/FileaClaim/AddaClaim";
import FileaClaimList from "components/FileaClaim/FileaClaimList";
import OnlinePayment from "components/WebForms/OnlinePayment";
import EditOnlinePayment from "components/WebForms/EditOnlinePayment";
import EditContactUs from "components/WebForms/EditContactUs";
import EditCallBack from "components/WebForms/EditCallBack";
import GetRates from "components/GetRates/GetRates";
import ReceiptIcon from "@material-ui/icons/Receipt";
import addclaimconformation from "components/FileaClaim/addclaimconformation";
import EditSalesLeads from "components/SalesLeads/EditSalesLeads";
import SearchSalesLeads from "components/SalesLeads/SearchSalesLeads";
import Shipment from "components/Shipment/Shipment";
import MyShipmentNew from "components/MyShipment/MyShipmentNew";
import ShipmentCustom from "components/ShipmentCustom/ShipmentCustom";
import ShipmentCalendar from "components/ShipmentCalendar/ShipmentCalendar";
import ViewFileAClaim from "components/FileaClaim/ViewFileAClaim";
import ScheduleConfirmation from "components/ScheduleConfirmation/ScheduleConfirmation";
import Service from "components/Management/Service/Service";
import addStringMap from "components/StringMap/addStringMap";
import UserAccess from "components/User Access/UserAccess";
import addModule from "components/User Access/addModule";
import AddContainer from "components/Management/ContainerMgmt/addContainer";
import EditContainer from "components/Management/ContainerMgmt/editContainer";
import Container from "components/Management/ContainerMgmt/containerList";
import LeadAssignment from "components/Management/SalesLead Assignment/LeadUserList";
import EditLeadAssignment from "components/Management/SalesLead Assignment/EditLeadAccess";
import ConsolidationCenterList from "components/Management/Consolidation Center/ConsolidationCenterList";
import AddConsolidationCenter from "components/Management/Consolidation Center/AddConsolidationCenter";
import AddUpdateMarkupRate from "components/Management/Consolidation Center/AddUpdateMarkupRate";
import CreditCardList from "components/Management/Card Management/CreditCardList";
import EditService from "components/Management/Service/EditService";
import AddService from "components/Management/Service/AddService";
import AccountReceivable from "components/Reports/AccountReceivable";
import AccountPayable from "components/Reports/AccountPayable";
import ShipmentNotCleared from "components/Reports/ShipmentNotCleared";
import SalesCommission from "components/Reports/SalesCommission";
import AllSales from "components/Reports/AllSales";
import ReportNavigation from "components/Reports/ReportNavigation";
import ManagementNavigation from "components/Management/ManagementNavigation";
import BillingInvoice from "components/BillingInvoice/BillingInvoice";
import confirmOnlinePayment from "components/BillingInvoice/confirmOnlinePayment";
import AllAccountReports from "components/Reports/AllAccountReports";
import ReviewReports from "components/Reports/ReviewReport";
import BulkShipmentImport from "components/Reports/BulkShipmentImport";
import UserLoginReport from "components/Reports/UserLoginReport";
import AllSalesReports from "components/Reports/AllSalesReports";
import ShipmentReport from "components/Reports/ShipmentReport";
import PrintCommercialInvoice from "components/ShipmentDocumentation/PrintCommercialInvoice";
import PrintInvoice from "components/ShipmentDocumentation/PrintInvoice";
import AllInputs from "components/SalesLeads/AllInputs";
import SalesLeadNavigation from "components/SalesLeads/SalesLeadNavigation";
import ShipmentNavigation from "components/Shipment/ShipmentNavigation";
import esign_employee from "components/Esign/esign_employee";
// import esign_client from "components/Esign/esign_client";
import esign_client_v3 from "components/Esign/Esign_Client_v3";
import esign_client_temp from "components/Esign/esign_client_temp";
import esign_employee_temp from "components/Esign/esign_employee_temp";
import FedExReport from "components/Reports/FedExReport";
import LockedReport from "components/Reports/LockedReports";
import StandardInvoiceReport from "components/Reports/StandardInvoice";
import ChatbotReport from "components/Chatbot/ChatReport";
// import Chatbot from "components/Chatbot/Chatbot";
import Review from "components/Management/Review/Review";
import ReviewTemplate from "components/Management/Review/ReviewTemplate";

// @material-ui/icons
import GateRatesIcon from "@material-ui/icons/AttachMoney";
import ScheduleShipmentIcon from "@material-ui/icons/DateRange";
import ChatIcon from "@material-ui/icons/Chat";
import WebForms from "@material-ui/icons/Public";
import Management from "@material-ui/icons/SupervisorAccount";
import FileaClaim from "@material-ui/icons/NoteAdd";
import SalesLeadIcon from "@material-ui/icons/Assessment";
import EditSalesLeadIcon from "@material-ui/icons/Edit";
import Search from "@material-ui/icons/Search";
import ContactUsIcon from "@material-ui/icons/Contacts";
import CallBackIcon from "@material-ui/icons/Call";
import PaymentIcon from "@material-ui/icons/Payment";
import User from "@material-ui/icons/AccountBox";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import BeenhereIcon from "@material-ui/icons/Beenhere";
// import PlusOne from "@material-ui/icons/PlusOne";FedExReport
import TodayIcon from "@material-ui/icons/Today";
import MapVendor from "components/Management/Vendor/MapVendor";
import OceanAutoTracking from "components/Management/OceanAutoTrackingList";
import AddUpdateBombinoRates from "components/Management/AddUpdateBombinoRates";
import VendorListIcon from "@material-ui/icons/FormatListBulleted";
import ReferredBy from "components/Management/ReferredBy";
import SearchBar from "components/SearchBar/SearchBar";
import ReSearchBar from "components/SearchBar/ReSearchBar";
import ArchiveIcon from "@material-ui/icons/Archive";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ChatManagement from "components/Management/ChatManagement";
import GetQuoteLive from "components/GetQuote/GetQuoteLive";
import GetQuoteThankyou from "components/GetQuote/GetQuoteThankyou";
const Components = {
  GetRates: GetRates,
};

var dashRoutes = [
  {
    path: "/GetRates",
    name: "Get Rates",
    icon: GateRatesIcon,
    component: Components["GetRates"],
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/MyShipmentNew",
    name: "MyShipmentNew",
    icon: GateRatesIcon,
    component: MyShipmentNew,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ShipmentList",
    name: "MyShipment",
    icon: BeenhereIcon,
    component: ShipmentNavigation,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/Shipment",
    name: "Shipment",
    icon: GateRatesIcon,
    component: Shipment,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ShipmentList",
    name: "Shipment",
    icon: DirectionsBoatIcon,
    component: ShipmentNavigation,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/ShipmentNew",
    name: "Shipment",
    icon: GateRatesIcon,
    component: ShipmentCustom,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ShipmentCalendar",
    name: "Shipment",
    icon: TodayIcon,
    component: ShipmentCalendar,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ScheduleConfirmation",
    name: "Schedule Confirm",
    icon: GateRatesIcon,
    component: ScheduleConfirmation,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/Scheduleshipment",
    name: "Schedule Shipment",
    icon: ScheduleShipmentIcon,
    component: Scheduleshipment,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/Chatbot",
    name: "Chat",
    icon: ChatIcon,
    component: ChatbotReport,
    layout: "/admin",
    invisible: true,
  },
  // {
  //   path: "/ShowChat",
  //   name: "Show Chat",
  //   icon: EditSalesLeadIcon,
  //   component: Chatbot,
  //   layout: "/admin",
  //   invisible: false,
  // },
  {
    path: "/PrintCommercialInvoice",
    name: "PrintCommercialInvoice",
    icon: ScheduleShipmentIcon,
    component: PrintCommercialInvoice,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/PrintInvoice",
    name: "PrintInvoice",
    icon: ScheduleShipmentIcon,
    component: PrintInvoice,
    layout: "/auth",
    invisible: false,
  },

  {
    path: "/SalesLeads",
    name: "Sales Leads",
    icon: SalesLeadIcon,
    component: SalesLeadNavigation,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/EditSalesLeads",
    component: EditSalesLeads,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/SearchSalesLeads",
    name: "Search Sales Leads",
    icon: Search,
    component: SearchSalesLeads,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/AllInputs",
    name: "All Inputs",
    component: AllInputs,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ShipmentNavigation",
    name: "Shipment Navigation",
    component: ShipmentNavigation,
    layout: "/admin",
    invisible: false,
  },
  {
    collapse: true,
    name: "Web Forms",
    icon: WebForms,
    state: "Web Forms",
    views: [
      {
        path: "/ContactUs",
        name: "Contact Us",
        mini: "PP",
        icon: ContactUsIcon,
        component: ContactUs,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/EditContactUs/:id",
        name: "Edit Contact Us",
        mini: "PP",
        icon: EditSalesLeadIcon,
        component: EditContactUs,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/CallBack",
        name: "Call Back",
        icon: CallBackIcon,
        component: CallBack,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/EditCallBack/:id",
        name: "Edit Call Back",
        icon: EditSalesLeadIcon,
        component: EditCallBack,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/OnlinePayment",
        name: "Online Payment",
        icon: PaymentIcon,
        component: OnlinePayment,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/EditOnlinePayment/:id",
        component: EditOnlinePayment,
        layout: "/admin",
        invisible: false,
      },
    ],
  },
  {
    path: "/Reports",
    name: "Reports",
    component: ReportNavigation,
    layout: "/admin",
    invisible: true,
    icon: AssignmentIcon,
  },

  {
    path: "/ManagementNavigation",
    name: "Management",
    component: ManagementNavigation,
    layout: "/admin",
    invisible: true,
    icon: Management,
  },

  {
    path: "/Billing",
    name: "Billing",
    component: BillingInvoice,
    layout: "/admin",
    invisible: true,
    icon: ReceiptIcon,
  },

  {
    path: "/confirmOnlinePayment",
    name: "Confirm Online Payment",
    component: confirmOnlinePayment,
    layout: "/admin",
    invisible: true,
    icon: ReceiptIcon,
  },

  {
    path: "/AllAccountReports",
    name: "Account Reports",
    icon: User,
    component: AllAccountReports,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/ReviewReport",
    name: "Review Reports",
    icon: User,
    component: ReviewReports,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/BulkShipmentImport",
    name: "Bulk Shipment Import",
    icon: User,
    component: BulkShipmentImport,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/UserLoginReport",
    name: "User Login Report",
    icon: User,
    component: UserLoginReport,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/Review",
    name: "Review",
    icon: User,
    component: Review,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/AllSalesReports",
    name: "Sales Reports",
    icon: User,
    component: AllSalesReports,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/AccountReceivable",
    name: "Account Receivable",
    icon: User,
    component: AccountReceivable,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/AccountPayable",
    name: "Account Payable",
    icon: User,
    component: AccountPayable,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/ShipmentNotCleared",
    name: "Shipment Not Cleared",
    icon: User,
    component: ShipmentNotCleared,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/SalesCommission",
    name: "Sales Commission",
    icon: User,
    component: SalesCommission,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/AllSales",
    name: "All Sales",
    icon: User,
    component: AllSales,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/ShipmentReport",
    name: "ShipmentReport",
    icon: User,
    component: ShipmentReport,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/FedExReport",
    name: "FedExReport",
    icon: User,
    component: FedExReport,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/LockedReport",
    name: "LockedReport",
    icon: User,
    component: LockedReport,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/StandardInvoiceReport",
    name: "StandardInvoiceReport",
    icon: User,
    component: StandardInvoiceReport,
    layout: "/admin",
    invisible: true,
  },
  {
    collapse: true,
    name: "Management",
    icon: Management,
    state: "Management",
    views: [
      {
        path: "/UserList",
        name: "User Management",
        icon: User,
        component: UserList,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/AddUserNew",
        component: AddUserNew,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/EditUser",
        component: AddUserNew,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/VendorSearch",
        name: "Vendor Search",
        icon: Search,
        component: VendorSearch,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/Vendor",
        name: "Vendor",
        icon: VendorListIcon,
        component: Vendor,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/AddEditVendor",
        name: "Edit Vendor",
        icon: EditSalesLeadIcon,
        component: EditVendor,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/MapVendor",
        name: "Map Vendor",
        icon: EditSalesLeadIcon,
        component: MapVendor,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/Service",
        name: "Service",
        icon: EditSalesLeadIcon,
        component: Service,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/Review",
        name: "Review",
        icon: EditSalesLeadIcon,
        component: Review,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/ReviewTemplate",
        name: "ReviewTemplate",
        component: ReviewTemplate,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/EditService/",
        name: "Edit Service",
        icon: EditSalesLeadIcon,
        component: EditService,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/AddService",
        name: "Add Service",
        icon: EditSalesLeadIcon,
        component: AddService,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/Container",
        name: "Container List",
        icon: LocalMoviesIcon,
        component: Container,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/AddContainer",
        name: "Add Container",
        icon: EditSalesLeadIcon,
        component: AddContainer,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/EditContainer",
        name: "Edit Container",
        icon: EditSalesLeadIcon,
        component: EditContainer,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/LeadUserList",
        name: "Lead Assignment",
        icon: ArchiveIcon,
        component: LeadAssignment,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/ChatManagement",
        name: "Chat Management",
        icon: ArchiveIcon,
        component: ChatManagement,
        layout: "/admin",
        invisible: true,
      },
      {
        path: "/EditLeadAccess",
        name: "Edit Lead Access",
        component: EditLeadAssignment,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/ConsolidationCenterList",
        name: "Consolidation Center List",
        icon: EditSalesLeadIcon,
        component: ConsolidationCenterList,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/AddConsolidationCenter",
        name: "Add Consolidation Center",
        icon: EditSalesLeadIcon,
        component: AddConsolidationCenter,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/AddUpdateMarkupRate",
        name: "Markup Rate",
        icon: EditSalesLeadIcon,
        component: AddUpdateMarkupRate,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/CreditCardList",
        name: "Credit Card List",
        icon: EditSalesLeadIcon,
        component: CreditCardList,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/OceanAutoTrackingList",
        name: "Ocean Auto Tracking List",
        icon: EditSalesLeadIcon,
        component: OceanAutoTracking,
        layout: "/admin",
        invisible: false,
      },
      {
        path: "/AddUpdateBombinoRates",
        name: "Bombino Rates Management",
        icon: EditSalesLeadIcon,
        component: AddUpdateBombinoRates,
        layout: "/admin",
        invisible: false,
      },
    ],
  },
  {
    path: "/ReferredBy",
    name: "Referred Management",
    icon: EditSalesLeadIcon,
    component: ReferredBy,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/AddaClaim",
    name: "Add a Claim",
    component: AddaClaim,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/FileaClaimList",
    name: "File a Claim",
    icon: FileaClaim,
    component: FileaClaimList,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/addclaimconformation",
    name: "Conformation Page",
    component: addclaimconformation,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ViewFileAClaim/:id",
    component: ViewFileAClaim,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/login-page",
    name: "Login Page",
    component: LoginPage,
    layout: "/auth",
    invisible: false,
  },
  // {
  //   path: "/get-quote",
  //   name: "Get Quote",
  //   component: GetQuoteLive,
  //   layout: "/auth",
  //   invisible: false,
  // },
  // {
  //   path: "/get-quote-thanks",
  //   name: "Get Quote Thank you",
  //   component: GetQuoteThankyou,
  //   layout: "/auth",
  //   invisible: false,
  // },
  {
    path: "/SalesLeadsRedirect-page/:id",
    name: "SalesLeadsRedirect Page",
    component: SalesLeadsRedirectPage,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/RedirectToMyShipment-page/:id",
    name: "RedirectToMyShipment Page",
    component: RedirectToMyShipment,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/register-page",
    name: "register-page",
    component: RegisterPage,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/forgotpassword-page",
    name: "Forgot Password Page",
    component: ForgotpasswordPage,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/ProfilePage",
    name: "ProfilePage",
    component: ProfilePage,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ResetPassword/:id",
    name: "ResetPassword",
    component: ResetPassword,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/addStringMap",
    name: "StringMap",
    component: addStringMap,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/addModule",
    name: "Module",
    component: addModule,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/UserAccess",
    name: "User Access",
    component: UserAccess,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/Search/:id",
    name: "Search",
    icon: Search,
    component: SearchBar,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/ReSearch/:id",
    name: "ReSearch",
    icon: Search,
    component: ReSearchBar,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/esign_employee",
    name: "esign_employee",
    icon: Search,
    component: esign_employee,
    layout: "/admin",
    invisible: false,
  },
  {
    path: "/esign_client/:id/:uuid",
    name: "esign_client",
    component: esign_client_temp,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/esign_client_v3",
    name: "esign_client_v3",
    component: esign_client_v3,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/esign_client_temp/:id/:uuid",
    name: "esign_client_temp",
    component: esign_client_temp,
    layout: "/auth",
    invisible: false,
  },
  {
    path: "/esign_employee_temp",
    name: "esign_employee_temp",
    component: esign_employee_temp,
    layout: "/auth",
    invisible: false,
  },

  // esign_client_v3 esign_employee_temp
];

export default dashRoutes;
