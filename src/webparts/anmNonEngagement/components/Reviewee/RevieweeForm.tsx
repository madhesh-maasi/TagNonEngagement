import * as React from "react";
import styles from "../AnmNonEngagement.module.scss";
import { IAnmNonEngagementProps } from "../IAnmNonEngagementProps";
import { escape } from "@microsoft/sp-lodash-subset";
import ListItemService from "../../../../services/ListItemService";
import UserService from "../../../../services/UserService";
import { Config } from "../../../../globals/Config";
import { Enums } from "../../../../globals/Enums";
import { User } from "../../../../domain/models/types/User";
import MapResult from "../../../../domain/mappers/MapResult";
import { TAG_GenericDetails } from "../../../../domain/models/TAG_EmployeeDetails";
import "react-dropdown/style.css";
import Dialog, {
  DialogFooter,
  DialogType,
} from "office-ui-fabric-react/lib/Dialog";
import { TAG_NonEngReviewSummary } from "../../../../domain/models/TAG_NonEngReviewSummary";
import { TAG_Projects } from "../../../../domain/models/TAG_Projects";
import Projects from "../Projects/Projects";
import RatingDropDown from "../Common/RatingDropDown";
import Dropdown from "react-dropdown";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { sp } from "@pnp/sp";
import "@pnp/sp/items";
import "@pnp/sp/webs";

const dialogContentProps = {
  type: DialogType.normal,
  title: "Confirmation",
  subText: "Data saved successfully.",
};

let finalQuestionsLength: number = null;
let count: number = null;

export default class RevieweeForm extends React.Component<any, {}> {
  private listItemService: ListItemService;
  private userService: UserService;
  private submmited: any;
  private isDisabed = false;
  private statusReview = "";
  private webUrl = "";
  private redirectURL = "";
  constructor(props: any) {
    super(props);
    this.state = {
      IsLoading: true,
      AppContext: this.props.AppContext,
      allFiscalYear: [],
      allRoles: [],
      selectedFYYear: "",
      selectedRole: "",
      fields: {},
      currentuser: {},
      mentor: {},
      showModel: true,
      nonEngReviewData: "",
      allProjects: [],
      Fields: {},
      data: ["4", "3", "2", "1"],
      itemId: 0,
      isReviewee: false,
      isMentor: true,
      allQuestions: [],
      singOff: "",
    };
  }
  // private getListsTitles(): void {
  //     this.setState({
  //         loadingLists: true,
  //         listTitles: [],
  //         error: null
  //     });

  //     const context: SP.ClientContext = new SP.ClientContext("https://smarttechies.sharepoint.com/sites/tagperfmgmt");
  //     var oList = context.get_web().get_lists().getByTitle('Non Engagement Review Template');

  //     let oListItem = oList.getItemById(43);
  //     oListItem.set_item('_x0052_DQ1', 'Updated By Jsom');

  //     oListItem.update();
  //     context.executeQueryAsync((sender: any, args: SP.ClientRequestSucceededEventArgs): void => {
  //         alert("updated..");
  //     }, (sender: any, args: SP.ClientRequestFailedEventArgs): void => {
  //         this.setState({
  //             loadingLists: false,
  //             listTitles: [],
  //             error: args.get_message()
  //         });
  //         alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
  //     });
  // }
  public async componentDidMount() {
    finalQuestionsLength = null;
    count = 0;
    let dateforamt = this.dateFormat(new Date());
    console.log("dateis", dateforamt);
    // SPComponentLoader.loadScript('/_layouts/15/init.js', {
    //     globalExportsName: '$_global_init'
    // })
    //     .then((): Promise<{}> => {
    //         return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', {
    //             globalExportsName: 'Sys'
    //         });
    //     })
    //     .then((): Promise<{}> => {
    //         return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', {
    //             globalExportsName: 'SP'
    //         });
    //     })
    //     .then((): Promise<{}> => {
    //         return SPComponentLoader.loadScript('/_layouts/15/SP.js', {
    //             globalExportsName: 'SP'
    //         });
    //     })
    //     .then((): void => {
    //         this.setState({
    //             loadingScripts: false
    //         });
    //         this.getListsTitles();
    //     });
    // Fetch Loggred user name, Roles and tax year, Mentor
    this.webUrl = await sp.site.getWebUrlFromPageUrl(window.location.href);

    let itemId = "";
    if (this.props.ItemID == null || this.props.ItemID == undefined) {
      itemId = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      );
    } else {
      itemId = this.props.ItemID;
    }
    this.setState({ ItemID: parseInt(itemId) });
    console.log("props reviewform", this.props);

    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.NonEngReview
    );

    const nonEngReviewData: TAG_NonEngReviewSummary =
      await this.listItemService.getItemUsingCAML(
        parseInt(itemId),
        [
          Config.NonEngagementReviewTemplateColumns.FiscalYear,
          Config.NonEngagementReviewTemplateColumns.Role,
          Config.NonEngagementReviewTemplateColumns.RevieweeName,
          Config.NonEngagementReviewTemplateColumns.Mentor,
          Config.NonEngagementReviewTemplateColumns.SignoffHistory,
          Config.NonEngagementReviewTemplateColumns.StatusReview,
          Config.NonEngagementReviewTemplateColumns.Submitted,
          Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths,
          Config.NonEngagementReviewTemplateColumns.SummaryOfImprovement,
          Config.NonEngagementReviewTemplateColumns.SummaryOfProgress,
          Config.NonEngagementReviewTemplateColumns.OtherConsiderations,
          Config.NonEngagementReviewTemplateColumns.RDTAQ1,
          Config.NonEngagementReviewTemplateColumns.RDTAQ2,
          Config.NonEngagementReviewTemplateColumns.RDTAQ3,
          Config.NonEngagementReviewTemplateColumns.RDTAComments,
          Config.NonEngagementReviewTemplateColumns.RAC,
          Config.NonEngagementReviewTemplateColumns.ORC,
          Config.NonEngagementReviewTemplateColumns.FYYTDUtilization,
          ,
          Config.NonEngagementReviewTemplateColumns.RDComments,
          Config.NonEngagementReviewTemplateColumns.PDComments,
          Config.NonEngagementReviewTemplateColumns.BDComments,
          Config.NonEngagementReviewTemplateColumns.GetRDQ1,
          Config.NonEngagementReviewTemplateColumns.GetRDQ2,
          Config.NonEngagementReviewTemplateColumns.GetRDQ3,
          Config.NonEngagementReviewTemplateColumns.GetRDQ4,
          Config.NonEngagementReviewTemplateColumns.GetRDQ5,
          Config.NonEngagementReviewTemplateColumns.GetBQ1,
          Config.NonEngagementReviewTemplateColumns.GetBQ2,
          Config.NonEngagementReviewTemplateColumns.GetBQ3,
          Config.NonEngagementReviewTemplateColumns.GetBQ4,
          Config.NonEngagementReviewTemplateColumns.GetPD1,
          Config.NonEngagementReviewTemplateColumns.GetPD2,
          Config.NonEngagementReviewTemplateColumns.GetPD3,
          Config.NonEngagementReviewTemplateColumns.GetPD4,

          /* Deva Changes Start */
          Config.NonEngagementReviewTemplateColumns.GetBQ5,
          Config.NonEngagementReviewTemplateColumns.GetBQ6,
          Config.NonEngagementReviewTemplateColumns.GetBQ7,
          Config.NonEngagementReviewTemplateColumns.GetBQ8,
          Config.NonEngagementReviewTemplateColumns.GetBQ9,
          Config.NonEngagementReviewTemplateColumns.GetBQ10,

          Config.NonEngagementReviewTemplateColumns.GetRDQ6,
          Config.NonEngagementReviewTemplateColumns.GetRDQ7,
          Config.NonEngagementReviewTemplateColumns.GetRDQ8,
          Config.NonEngagementReviewTemplateColumns.GetRDQ9,
          Config.NonEngagementReviewTemplateColumns.GetRDQ10,

          Config.NonEngagementReviewTemplateColumns.GetPD5,
          Config.NonEngagementReviewTemplateColumns.GetPD6,
          Config.NonEngagementReviewTemplateColumns.GetPD7,
          Config.NonEngagementReviewTemplateColumns.GetPD8,
          Config.NonEngagementReviewTemplateColumns.GetPD9,
          Config.NonEngagementReviewTemplateColumns.GetPD10,

          Config.NonEngagementReviewTemplateColumns.RDTAQ4,
          Config.NonEngagementReviewTemplateColumns.RDTAQ5,
          Config.NonEngagementReviewTemplateColumns.RDTAQ6,
          Config.NonEngagementReviewTemplateColumns.RDTAQ7,
          Config.NonEngagementReviewTemplateColumns.RDTAQ8,
          Config.NonEngagementReviewTemplateColumns.RDTAQ9,
          Config.NonEngagementReviewTemplateColumns.RDTAQ10,

          Config.NonEngagementReviewTemplateColumns.GetLQ1,
          Config.NonEngagementReviewTemplateColumns.GetLQ2,
          Config.NonEngagementReviewTemplateColumns.GetLQ3,
          Config.NonEngagementReviewTemplateColumns.GetLQ4,
          Config.NonEngagementReviewTemplateColumns.GetLQ5,
          Config.NonEngagementReviewTemplateColumns.GetLQ6,
          Config.NonEngagementReviewTemplateColumns.GetLQ7,
          Config.NonEngagementReviewTemplateColumns.GetLQ8,
          Config.NonEngagementReviewTemplateColumns.GetLQ9,
          Config.NonEngagementReviewTemplateColumns.GetLQ10,

          Config.NonEngagementReviewTemplateColumns.GetPQ1,
          Config.NonEngagementReviewTemplateColumns.GetPQ2,
          Config.NonEngagementReviewTemplateColumns.GetPQ3,
          Config.NonEngagementReviewTemplateColumns.GetPQ4,
          Config.NonEngagementReviewTemplateColumns.GetPQ5,
          Config.NonEngagementReviewTemplateColumns.GetPQ6,
          Config.NonEngagementReviewTemplateColumns.GetPQ7,
          Config.NonEngagementReviewTemplateColumns.GetPQ8,
          Config.NonEngagementReviewTemplateColumns.GetPQ9,
          Config.NonEngagementReviewTemplateColumns.GetPQ10,

          Config.NonEngagementReviewTemplateColumns.RDCQ1,
          Config.NonEngagementReviewTemplateColumns.RDCQ2,
          Config.NonEngagementReviewTemplateColumns.RDCQ3,
          Config.NonEngagementReviewTemplateColumns.RDCQ4,
          Config.NonEngagementReviewTemplateColumns.RDCQ5,
          Config.NonEngagementReviewTemplateColumns.RDCQ6,
          Config.NonEngagementReviewTemplateColumns.RDCQ7,
          Config.NonEngagementReviewTemplateColumns.RDCQ8,
          Config.NonEngagementReviewTemplateColumns.RDCQ9,
          Config.NonEngagementReviewTemplateColumns.RDCQ10,

          Config.NonEngagementReviewTemplateColumns.BDComments1,
          Config.NonEngagementReviewTemplateColumns.BDComments2,
          Config.NonEngagementReviewTemplateColumns.BDComments3,
          Config.NonEngagementReviewTemplateColumns.BDComments4,
          Config.NonEngagementReviewTemplateColumns.BDComments5,
          Config.NonEngagementReviewTemplateColumns.BDComments6,
          Config.NonEngagementReviewTemplateColumns.BDComments7,
          Config.NonEngagementReviewTemplateColumns.BDComments8,
          Config.NonEngagementReviewTemplateColumns.BDComments9,
          Config.NonEngagementReviewTemplateColumns.BDComments10,

          Config.NonEngagementReviewTemplateColumns.RDComments1,
          Config.NonEngagementReviewTemplateColumns.RDComments2,
          Config.NonEngagementReviewTemplateColumns.RDComments3,
          Config.NonEngagementReviewTemplateColumns.RDComments4,
          Config.NonEngagementReviewTemplateColumns.RDComments5,
          Config.NonEngagementReviewTemplateColumns.RDComments6,
          Config.NonEngagementReviewTemplateColumns.RDComments7,
          Config.NonEngagementReviewTemplateColumns.RDComments8,
          Config.NonEngagementReviewTemplateColumns.RDComments9,
          Config.NonEngagementReviewTemplateColumns.RDComments10,

          Config.NonEngagementReviewTemplateColumns.PDComments1,
          Config.NonEngagementReviewTemplateColumns.PDComments2,
          Config.NonEngagementReviewTemplateColumns.PDComments3,
          Config.NonEngagementReviewTemplateColumns.PDComments4,
          Config.NonEngagementReviewTemplateColumns.PDComments5,
          Config.NonEngagementReviewTemplateColumns.PDComments6,
          Config.NonEngagementReviewTemplateColumns.PDComments7,
          Config.NonEngagementReviewTemplateColumns.PDComments8,
          Config.NonEngagementReviewTemplateColumns.PDComments9,
          Config.NonEngagementReviewTemplateColumns.PDComments10,

          Config.NonEngagementReviewTemplateColumns.RDTAComments1,
          Config.NonEngagementReviewTemplateColumns.RDTAComments2,
          Config.NonEngagementReviewTemplateColumns.RDTAComments3,
          Config.NonEngagementReviewTemplateColumns.RDTAComments4,
          Config.NonEngagementReviewTemplateColumns.RDTAComments5,
          Config.NonEngagementReviewTemplateColumns.RDTAComments6,
          Config.NonEngagementReviewTemplateColumns.RDTAComments7,
          Config.NonEngagementReviewTemplateColumns.RDTAComments8,
          Config.NonEngagementReviewTemplateColumns.RDTAComments9,
          Config.NonEngagementReviewTemplateColumns.RDTAComments10,

          Config.NonEngagementReviewTemplateColumns.LCComments1,
          Config.NonEngagementReviewTemplateColumns.LCComments2,
          Config.NonEngagementReviewTemplateColumns.LCComments3,
          Config.NonEngagementReviewTemplateColumns.LCComments4,
          Config.NonEngagementReviewTemplateColumns.LCComments5,
          Config.NonEngagementReviewTemplateColumns.LCComments6,
          Config.NonEngagementReviewTemplateColumns.LCComments7,
          Config.NonEngagementReviewTemplateColumns.LCComments8,
          Config.NonEngagementReviewTemplateColumns.LCComments9,
          Config.NonEngagementReviewTemplateColumns.LCComments10,

          Config.NonEngagementReviewTemplateColumns.POComments1,
          Config.NonEngagementReviewTemplateColumns.POComments2,
          Config.NonEngagementReviewTemplateColumns.POComments3,
          Config.NonEngagementReviewTemplateColumns.POComments4,
          Config.NonEngagementReviewTemplateColumns.POComments5,
          Config.NonEngagementReviewTemplateColumns.POComments6,
          Config.NonEngagementReviewTemplateColumns.POComments7,
          Config.NonEngagementReviewTemplateColumns.POComments8,
          Config.NonEngagementReviewTemplateColumns.POComments9,
          Config.NonEngagementReviewTemplateColumns.POComments10,

          Config.NonEngagementReviewTemplateColumns.RDCComments1,
          Config.NonEngagementReviewTemplateColumns.RDCComments2,
          Config.NonEngagementReviewTemplateColumns.RDCComments3,
          Config.NonEngagementReviewTemplateColumns.RDCComments4,
          Config.NonEngagementReviewTemplateColumns.RDCComments5,
          Config.NonEngagementReviewTemplateColumns.RDCComments6,
          Config.NonEngagementReviewTemplateColumns.RDCComments7,
          Config.NonEngagementReviewTemplateColumns.RDCComments8,
          Config.NonEngagementReviewTemplateColumns.RDCComments9,
          Config.NonEngagementReviewTemplateColumns.RDCComments10,
          /* Deva Changes End */
        ],
        undefined,
        Enums.ItemResultType.TAG_NonEngReviewSummary
      );

    console.log("nonEngReviewData", nonEngReviewData);

    this.setState({
      isReviweeDisabled:
        nonEngReviewData[
          Config.NonEngagementReviewTemplateColumns.StatusReview
        ] == "Awaiting Reviewee"
          ? false
          : true,
    });

    console.log("nonEngReviewData", nonEngReviewData);

    this.submmited =
      nonEngReviewData[Config.NonEngagementReviewTemplateColumns.Submitted];
    this.statusReview = nonEngReviewData["StatusReview"];
    this.checkCurrentUserType(nonEngReviewData);
    this.setDefaultValue(nonEngReviewData);
    this.listItemService
      .getAllVersion(parseInt(itemId), Config.ListNames.NonEngReview)
      .then((res) => {
        console.log("Version History..", res);
        if (res) this.setState({ signOffHistory: res.Versions });
      });

    this.listItemService
      .getAllFilteresData(
        Config.ListNames.Questionnaire,
        nonEngReviewData[Config.NonEngagementReviewTemplateColumns.Role]
      )
      .then((res) => {
        console.log("Questionaire..", res);
        finalQuestionsLength = res.length;
        console.log("finalQuestionsLength => ", finalQuestionsLength);
        if (res) this.setState({ allQuestions: res });
      });
    const camlFilterConditions =
      "<Where><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE' /><Value Type='Lookup'>" +
      nonEngReviewData.RevieweeName.Id +
      "</Value></Eq></Where>";
    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.Projects
    );
    const allProjects: TAG_Projects[] =
      await this.listItemService.getItemsUsingCAML(
        [
          Config.ProjectListColumns.ProjectName,
          Config.ProjectListColumns.HoursWorked,
          Config.ProjectListColumns.ReviewerName,
          Config.ProjectListColumns.ClientName,
        ],
        "Id",
        camlFilterConditions,
        100,
        Enums.ItemResultType.TAG_Projects
      );

    //console.log("allProjects", allProjects);
    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.Mentor
    );
    //const mentor: User = await this.listItemService.GetMentorOfEmployee(this.props.user);
    this.setState({
      nonEngReviewData: nonEngReviewData,
      currentuser: this.props.user,
    });
  }

  public checkCurrentUserType = async (data) => {
    this.userService = new UserService(this.props.AppContext);
    let expectedCurrentUser: User = await this.userService.GetCurrentUser();
    if (expectedCurrentUser.Id == data["RevieweeName"]["Id"]) {
      this.setState({ isReviewee: true });
      this.isDisabed =
        this.statusReview == "Awaiting Mentor" ||
        this.statusReview == "Awaiting Acknowledgement" ||
        this.statusReview == "Acknowledged";
      this.setState({ isMentor: false });
      this.redirectURL = this.webUrl + "/SitePages/Reviewee.aspx";
      console.log("User Is revieww");
    } else if (expectedCurrentUser.Id == data["Mentor"]["Id"]) {
      this.setState({ isMentor: true });
      this.setState({ isReviewee: false });
      this.isDisabed = this.statusReview !== "Awaiting Mentor";
      this.redirectURL = this.webUrl + "/SitePages/Reviewer.aspx";
      console.log("User Is Mentor");
    } else {
      console.log("No Access");
    }
  };

  /* Deva changes start */
  public isRevieweeSubmit = (): boolean => {
    let valid: boolean = false;
    let fields = this.state["Fields"];
    let arrAllQuestion: string[] = [];
    if (fields["Business Development1"]) {
      arrAllQuestion.push(fields["Business Development1"]);
    }
    if (fields["Business Development2"]) {
      arrAllQuestion.push(fields["Business Development2"]);
    }
    if (fields["Business Development3"]) {
      arrAllQuestion.push(fields["Business Development3"]);
    }
    if (fields["Business Development4"]) {
      arrAllQuestion.push(fields["Business Development4"]);
    }
    if (fields["Business Development5"]) {
      arrAllQuestion.push(fields["Business Development5"]);
    }
    if (fields["Business Development6"]) {
      arrAllQuestion.push(fields["Business Development6"]);
    }
    if (fields["Business Development7"]) {
      arrAllQuestion.push(fields["Business Development7"]);
    }
    if (fields["Business Development8"]) {
      arrAllQuestion.push(fields["Business Development8"]);
    }
    if (fields["Business Development9"]) {
      arrAllQuestion.push(fields["Business Development9"]);
    }
    if (fields["Business Development10"]) {
      arrAllQuestion.push(fields["Business Development10"]);
    }
    if (fields["Relationship Development1"]) {
      arrAllQuestion.push(fields["Relationship Development1"]);
    }
    if (fields["Relationship Development2"]) {
      arrAllQuestion.push(fields["Relationship Development2"]);
    }
    if (fields["Relationship Development3"]) {
      arrAllQuestion.push(fields["Relationship Development3"]);
    }
    if (fields["Relationship Development4"]) {
      arrAllQuestion.push(fields["Relationship Development4"]);
    }
    if (fields["Relationship Development5"]) {
      arrAllQuestion.push(fields["Relationship Development5"]);
    }
    if (fields["Relationship Development6"]) {
      arrAllQuestion.push(fields["Relationship Development6"]);
    }
    if (fields["Relationship Development7"]) {
      arrAllQuestion.push(fields["Relationship Development7"]);
    }
    if (fields["Relationship Development8"]) {
      arrAllQuestion.push(fields["Relationship Development8"]);
    }
    if (fields["Relationship Development9"]) {
      arrAllQuestion.push(fields["Relationship Development9"]);
    }
    if (fields["Relationship Development10"]) {
      arrAllQuestion.push(fields["Relationship Development10"]);
    }
    if (fields["Practice Development1"]) {
      arrAllQuestion.push(fields["Practice Development1"]);
    }
    if (fields["Practice Development2"]) {
      arrAllQuestion.push(fields["Practice Development2"]);
    }
    if (fields["Practice Development3"]) {
      arrAllQuestion.push(fields["Practice Development3"]);
    }
    if (fields["Practice Development4"]) {
      arrAllQuestion.push(fields["Practice Development4"]);
    }
    if (fields["Practice Development5"]) {
      arrAllQuestion.push(fields["Practice Development5"]);
    }
    if (fields["Practice Development6"]) {
      arrAllQuestion.push(fields["Practice Development6"]);
    }
    if (fields["Practice Development7"]) {
      arrAllQuestion.push(fields["Practice Development7"]);
    }
    if (fields["Practice Development8"]) {
      arrAllQuestion.push(fields["Practice Development8"]);
    }
    if (fields["Practice Development9"]) {
      arrAllQuestion.push(fields["Practice Development9"]);
    }
    if (fields["Practice Development10"]) {
      arrAllQuestion.push(fields["Practice Development10"]);
    }
    if (fields["Developing RDTA characteristics1"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics1"]);
    }
    if (fields["Developing RDTA characteristics2"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics2"]);
    }
    if (fields["Developing RDTA characteristics3"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics3"]);
    }
    if (fields["Developing RDTA characteristics4"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics4"]);
    }
    if (fields["Developing RDTA characteristics5"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics5"]);
    }
    if (fields["Developing RDTA characteristics6"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics6"]);
    }
    if (fields["Developing RDTA characteristics7"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics7"]);
    }
    if (fields["Developing RDTA characteristics8"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics8"]);
    }
    if (fields["Developing RDTA characteristics9"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics9"]);
    }
    if (fields["Developing RDTA characteristics10"]) {
      arrAllQuestion.push(fields["Developing RDTA characteristics10"]);
    }
    if (fields["Living Culture and Core Values1"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values1"]);
    }
    if (fields["Living Culture and Core Values2"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values2"]);
    }
    if (fields["Living Culture and Core Values3"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values3"]);
    }
    if (fields["Living Culture and Core Values4"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values4"]);
    }
    if (fields["Living Culture and Core Values5"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values5"]);
    }
    if (fields["Living Culture and Core Values6"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values6"]);
    }
    if (fields["Living Culture and Core Values7"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values7"]);
    }
    if (fields["Living Culture and Core Values8"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values8"]);
    }
    if (fields["Living Culture and Core Values9"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values9"]);
    }
    if (fields["Living Culture and Core Values10"]) {
      arrAllQuestion.push(fields["Living Culture and Core Values10"]);
    }
    if (fields["Practice Operations1"]) {
      arrAllQuestion.push(fields["Practice Operations1"]);
    }
    if (fields["Practice Operations2"]) {
      arrAllQuestion.push(fields["Practice Operations2"]);
    }
    if (fields["Practice Operations3"]) {
      arrAllQuestion.push(fields["Practice Operations3"]);
    }
    if (fields["Practice Operations4"]) {
      arrAllQuestion.push(fields["Practice Operations4"]);
    }
    if (fields["Practice Operations5"]) {
      arrAllQuestion.push(fields["Practice Operations5"]);
    }
    if (fields["Practice Operations6"]) {
      arrAllQuestion.push(fields["Practice Operations6"]);
    }
    if (fields["Practice Operations7"]) {
      arrAllQuestion.push(fields["Practice Operations7"]);
    }
    if (fields["Practice Operations8"]) {
      arrAllQuestion.push(fields["Practice Operations8"]);
    }
    if (fields["Practice Operations9"]) {
      arrAllQuestion.push(fields["Practice Operations9"]);
    }
    if (fields["Practice Operations10"]) {
      arrAllQuestion.push(fields["Practice Operations10"]);
    }
    if (fields["Relationship Development Comments1"]) {
      arrAllQuestion.push(fields["Relationship Development Comments1"]);
    }
    if (fields["Relationship Development Comments2"]) {
      arrAllQuestion.push(fields["Relationship Development Comments2"]);
    }
    if (fields["Relationship Development Comments3"]) {
      arrAllQuestion.push(fields["Relationship Development Comments3"]);
    }
    if (fields["Relationship Development Comments4"]) {
      arrAllQuestion.push(fields["Relationship Development Comments4"]);
    }
    if (fields["Relationship Development Comments5"]) {
      arrAllQuestion.push(fields["Relationship Development Comments5"]);
    }
    if (fields["Relationship Development Comments6"]) {
      arrAllQuestion.push(fields["Relationship Development Comments6"]);
    }
    if (fields["Relationship Development Comments7"]) {
      arrAllQuestion.push(fields["Relationship Development Comments7"]);
    }
    if (fields["Relationship Development Comments8"]) {
      arrAllQuestion.push(fields["Relationship Development Comments8"]);
    }
    if (fields["Relationship Development Comments9"]) {
      arrAllQuestion.push(fields["Relationship Development Comments9"]);
    }
    if (fields["Relationship Development Comments10"]) {
      arrAllQuestion.push(fields["Relationship Development Comments10"]);
    }
    if (fields["Business DevelopmentComments1"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments1"]);
    }
    if (fields["Business DevelopmentComments2"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments2"]);
    }
    if (fields["Business DevelopmentComments3"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments3"]);
    }
    if (fields["Business DevelopmentComments4"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments4"]);
    }
    if (fields["Business DevelopmentComments5"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments5"]);
    }
    if (fields["Business DevelopmentComments6"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments6"]);
    }
    if (fields["Business DevelopmentComments7"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments7"]);
    }
    if (fields["Business DevelopmentComments8"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments8"]);
    }
    if (fields["Business DevelopmentComments9"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments9"]);
    }
    if (fields["Business DevelopmentComments10"].trim()) {
      arrAllQuestion.push(fields["Business DevelopmentComments10"]);
    }
    if (fields["Relationship DevelopmentComments1"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments1"]);
    }
    if (fields["Relationship DevelopmentComments2"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments2"]);
    }
    if (fields["Relationship DevelopmentComments3"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments3"]);
    }
    if (fields["Relationship DevelopmentComments4"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments4"]);
    }
    if (fields["Relationship DevelopmentComments5"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments5"]);
    }
    if (fields["Relationship DevelopmentComments6"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments6"]);
    }
    if (fields["Relationship DevelopmentComments7"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments7"]);
    }
    if (fields["Relationship DevelopmentComments8"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments8"]);
    }
    if (fields["Relationship DevelopmentComments9"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments9"]);
    }
    if (fields["Relationship DevelopmentComments10"].trim()) {
      arrAllQuestion.push(fields["Relationship DevelopmentComments10"]);
    }
    if (fields["Practice DevelopmentComments1"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments1"]);
    }
    if (fields["Practice DevelopmentComments2"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments2"]);
    }
    if (fields["Practice DevelopmentComments3"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments3"]);
    }
    if (fields["Practice DevelopmentComments4"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments4"]);
    }
    if (fields["Practice DevelopmentComments5"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments5"]);
    }
    if (fields["Practice DevelopmentComments6"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments6"]);
    }
    if (fields["Practice DevelopmentComments7"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments7"]);
    }
    if (fields["Practice DevelopmentComments8"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments8"]);
    }
    if (fields["Practice DevelopmentComments9"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments9"]);
    }
    if (fields["Practice DevelopmentComments10"].trim()) {
      arrAllQuestion.push(fields["Practice DevelopmentComments10"]);
    }
    if (fields["Developing RDTA characteristicsComments1"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments1"]);
    }
    if (fields["Developing RDTA characteristicsComments2"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments2"]);
    }
    if (fields["Developing RDTA characteristicsComments3"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments3"]);
    }
    if (fields["Developing RDTA characteristicsComments4"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments4"]);
    }
    if (fields["Developing RDTA characteristicsComments5"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments5"]);
    }
    if (fields["Developing RDTA characteristicsComments6"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments6"]);
    }
    if (fields["Developing RDTA characteristicsComments7"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments7"]);
    }
    if (fields["Developing RDTA characteristicsComments8"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments8"]);
    }
    if (fields["Developing RDTA characteristicsComments9"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments9"]);
    }
    if (fields["Developing RDTA characteristicsComments10"].trim()) {
      arrAllQuestion.push(fields["Developing RDTA characteristicsComments10"]);
    }
    if (fields["Living Culture and Core ValuesComments1"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments1"]);
    }
    if (fields["Living Culture and Core ValuesComments2"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments2"]);
    }
    if (fields["Living Culture and Core ValuesComments3"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments3"]);
    }
    if (fields["Living Culture and Core ValuesComments4"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments4"]);
    }
    if (fields["Living Culture and Core ValuesComments5"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments5"]);
    }
    if (fields["Living Culture and Core ValuesComments6"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments6"]);
    }
    if (fields["Living Culture and Core ValuesComments7"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments7"]);
    }
    if (fields["Living Culture and Core ValuesComments8"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments8"]);
    }
    if (fields["Living Culture and Core ValuesComments9"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments9"]);
    }
    if (fields["Living Culture and Core ValuesComments10"].trim()) {
      arrAllQuestion.push(fields["Living Culture and Core ValuesComments10"]);
    }
    if (fields["Practice OperationsComments1"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments1"]);
    }
    if (fields["Practice OperationsComments2"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments2"]);
    }
    if (fields["Practice OperationsComments3"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments3"]);
    }
    if (fields["Practice OperationsComments4"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments4"]);
    }
    if (fields["Practice OperationsComments5"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments5"]);
    }
    if (fields["Practice OperationsComments6"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments6"]);
    }
    if (fields["Practice OperationsComments7"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments7"]);
    }
    if (fields["Practice OperationsComments8"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments8"]);
    }
    if (fields["Practice OperationsComments9"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments9"]);
    }
    if (fields["Practice OperationsComments10"].trim()) {
      arrAllQuestion.push(fields["Practice OperationsComments10"]);
    }
    if (fields["Relationship Development CommentsComments1"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments1"]);
    }
    if (fields["Relationship Development CommentsComments2"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments2"]);
    }
    if (fields["Relationship Development CommentsComments3"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments3"]);
    }
    if (fields["Relationship Development CommentsComments4"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments4"]);
    }
    if (fields["Relationship Development CommentsComments5"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments5"]);
    }
    if (fields["Relationship Development CommentsComments6"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments6"]);
    }
    if (fields["Relationship Development CommentsComments7"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments7"]);
    }
    if (fields["Relationship Development CommentsComments8"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments8"]);
    }
    if (fields["Relationship Development CommentsComments9"].trim()) {
      arrAllQuestion.push(fields["Relationship Development CommentsComments9"]);
    }
    if (fields["Relationship Development CommentsComments10"].trim()) {
      arrAllQuestion.push(
        fields["Relationship Development CommentsComments10"]
      );
    }
    if (finalQuestionsLength == arrAllQuestion.length) {
      valid = true;
    }
    return valid;
  };
  /* Deva changes end */

  public setDefaultValue = (data) => {
    console.log("data", data);
    let fields = this.state["Fields"];
    fields[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths] =
      data[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths];
    fields["SummaryOfStrengths"] =
      data[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths];
    fields["SummaryOfImprovement"] =
      data[Config.NonEngagementReviewTemplateColumns.SummaryOfImprovement];
    fields["SummaryOfProgress"] =
      data[Config.NonEngagementReviewTemplateColumns.SummaryOfProgress];
    fields["OtherConsiderations"] =
      data[Config.NonEngagementReviewTemplateColumns.OtherConsiderations];

    fields["RAC"] = data["RAC"];
    fields["ORC"] = data["ORC"];
    fields[Config.NonEngagementReviewTemplateColumns.FYYTDUtilization] =
      data[Config.NonEngagementReviewTemplateColumns.FYYTDUtilization];

    fields["Relationship Development1"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ1];
    fields["Relationship Development2"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ2];
    fields["Relationship Development3"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ3];
    fields["Relationship Development4"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ4];
    fields["Relationship Development5"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ5];
    fields["Relationship DevelopmentComments"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments];

    fields["Business Development1"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ1];
    fields["Business Development2"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ2];
    fields["Business Development3"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ3];
    fields["Business Development4"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ4];
    fields["Business DevelopmentComments"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments];

    fields["Practice Development1"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD1];
    fields["Practice Development2"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD2];
    fields["Practice Development3"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD3];
    fields["Practice Development4"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD4];
    fields["Practice DevelopmentComments"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments];

    fields["Developing RDTA characteristics1"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ1];
    fields["Developing RDTA characteristics2"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ2];
    fields["Developing RDTA characteristics3"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ3];
    fields["Developing RDTA characteristicsComments"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments];

    /* Deva Changes Start */
    fields["Business Development5"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ5];
    fields["Business Development6"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ6];
    fields["Business Development7"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ7];
    fields["Business Development8"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ8];
    fields["Business Development9"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ9];
    fields["Business Development10"] =
      data[Config.NonEngagementReviewTemplateColumns.GetBQ10];

    fields["Relationship Development6"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ6];
    fields["Relationship Development7"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ7];
    fields["Relationship Development8"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ8];
    fields["Relationship Development9"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ9];
    fields["Relationship Development10"] =
      data[Config.NonEngagementReviewTemplateColumns.GetRDQ10];

    fields["Practice Development5"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD5];
    fields["Practice Development6"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD6];
    fields["Practice Development7"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD7];
    fields["Practice Development8"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD8];
    fields["Practice Development9"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD9];
    fields["Practice Development10"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPD10];

    fields["Developing RDTA characteristics4"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ4];
    fields["Developing RDTA characteristics5"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ5];
    fields["Developing RDTA characteristics6"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ6];
    fields["Developing RDTA characteristics7"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ7];
    fields["Developing RDTA characteristics8"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ8];
    fields["Developing RDTA characteristics9"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ9];
    fields["Developing RDTA characteristics10"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAQ10];

    fields["Living Culture and Core Values1"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ1];
    fields["Living Culture and Core Values2"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ2];
    fields["Living Culture and Core Values3"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ3];
    fields["Living Culture and Core Values4"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ4];
    fields["Living Culture and Core Values5"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ5];
    fields["Living Culture and Core Values6"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ6];
    fields["Living Culture and Core Values7"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ7];
    fields["Living Culture and Core Values8"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ8];
    fields["Living Culture and Core Values9"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ9];
    fields["Living Culture and Core Values10"] =
      data[Config.NonEngagementReviewTemplateColumns.GetLQ10];

    fields["Practice Operations1"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ1];
    fields["Practice Operations2"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ2];
    fields["Practice Operations3"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ3];
    fields["Practice Operations4"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ4];
    fields["Practice Operations5"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ5];
    fields["Practice Operations6"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ6];
    fields["Practice Operations7"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ7];
    fields["Practice Operations8"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ8];
    fields["Practice Operations9"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ9];
    fields["Practice Operations10"] =
      data[Config.NonEngagementReviewTemplateColumns.GetPQ10];

    fields["Relationship Development Comments1"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ1];
    fields["Relationship Development Comments2"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ2];
    fields["Relationship Development Comments3"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ3];
    fields["Relationship Development Comments4"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ4];
    fields["Relationship Development Comments5"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ5];
    fields["Relationship Development Comments6"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ6];
    fields["Relationship Development Comments7"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ7];
    fields["Relationship Development Comments8"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ8];
    fields["Relationship Development Comments9"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ9];
    fields["Relationship Development Comments10"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCQ10];

    fields["Business DevelopmentComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments1];
    fields["Business DevelopmentComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments2];
    fields["Business DevelopmentComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments3];
    fields["Business DevelopmentComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments4];
    fields["Business DevelopmentComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments5];
    fields["Business DevelopmentComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments6];
    fields["Business DevelopmentComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments7];
    fields["Business DevelopmentComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments8];
    fields["Business DevelopmentComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments9];
    fields["Business DevelopmentComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.BDComments10];

    fields["Relationship DevelopmentComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments1];
    fields["Relationship DevelopmentComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments2];
    fields["Relationship DevelopmentComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments3];
    fields["Relationship DevelopmentComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments4];
    fields["Relationship DevelopmentComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments5];
    fields["Relationship DevelopmentComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments6];
    fields["Relationship DevelopmentComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments7];
    fields["Relationship DevelopmentComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments8];
    fields["Relationship DevelopmentComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments9];
    fields["Relationship DevelopmentComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.RDComments10];

    fields["Practice DevelopmentComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments1];
    fields["Practice DevelopmentComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments2];
    fields["Practice DevelopmentComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments3];
    fields["Practice DevelopmentComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments4];
    fields["Practice DevelopmentComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments5];
    fields["Practice DevelopmentComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments6];
    fields["Practice DevelopmentComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments7];
    fields["Practice DevelopmentComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments8];
    fields["Practice DevelopmentComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments9];
    fields["Practice DevelopmentComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.PDComments10];

    fields["Developing RDTA characteristicsComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments1];
    fields["Developing RDTA characteristicsComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments2];
    fields["Developing RDTA characteristicsComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments3];
    fields["Developing RDTA characteristicsComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments4];
    fields["Developing RDTA characteristicsComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments5];
    fields["Developing RDTA characteristicsComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments6];
    fields["Developing RDTA characteristicsComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments7];
    fields["Developing RDTA characteristicsComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments8];
    fields["Developing RDTA characteristicsComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments9];
    fields["Developing RDTA characteristicsComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.RDTAComments10];

    fields["Living Culture and Core ValuesComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments1];
    fields["Living Culture and Core ValuesComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments2];
    fields["Living Culture and Core ValuesComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments3];
    fields["Living Culture and Core ValuesComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments4];
    fields["Living Culture and Core ValuesComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments5];
    fields["Living Culture and Core ValuesComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments6];
    fields["Living Culture and Core ValuesComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments7];
    fields["Living Culture and Core ValuesComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments8];
    fields["Living Culture and Core ValuesComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments9];
    fields["Living Culture and Core ValuesComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.LCComments10];

    fields["Practice OperationsComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments1];
    fields["Practice OperationsComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments2];
    fields["Practice OperationsComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments3];
    fields["Practice OperationsComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments4];
    fields["Practice OperationsComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments5];
    fields["Practice OperationsComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments6];
    fields["Practice OperationsComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments7];
    fields["Practice OperationsComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments8];
    fields["Practice OperationsComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments9];
    fields["Practice OperationsComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.POComments10];

    fields["Relationship Development CommentsComments1"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments1];
    fields["Relationship Development CommentsComments2"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments2];
    fields["Relationship Development CommentsComments3"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments3];
    fields["Relationship Development CommentsComments4"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments4];
    fields["Relationship Development CommentsComments5"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments5];
    fields["Relationship Development CommentsComments6"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments6];
    fields["Relationship Development CommentsComments7"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments7];
    fields["Relationship Development CommentsComments8"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments8];
    fields["Relationship Development CommentsComments9"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments9];
    fields["Relationship Development CommentsComments10"] =
      data[Config.NonEngagementReviewTemplateColumns.RDCComments10];
    /* Deva Changes End */

    // fields["BQ3"] =  data[Config.NonEngagementReviewTemplateColumns.GetBQ3];
    // fields["BQ4"] =  data[Config.NonEngagementReviewTemplateColumns.GetBQ4];
    this.setState({ Fields: fields });
    console.log(this.state["Fields"]);
  };

  public onEventChange = (value, name) => {
    console.log(value);
    // let value = event.target.value;
    let fields = this.state["Fields"];
    fields[name] = value;
    this.setState({ Fields: fields });
    console.log(this.state["Fields"]);
  };

  public onRatingEventChange = (value, name) => {
    console.log("Rating", value, name);
    let fields = this.state["Fields"];
    fields[name] = value;
    this.setState({ Fields: fields });
    console.log(this.state["Fields"]);
  };

  public createQuestionaire = (): JSX.Element => {
    var rows = [];
    let row = [];
    if (this.state["allQuestions"]) {
      const groupData = this.state["allQuestions"].reduce(
        (groups, item) => ({
          ...groups,
          [item.Module]: [...(groups[item.Module] || []), item],
        }),
        {}
      );
      let modules = Object.keys(groupData);
      // console.log("modules", groupData, modules);
      let strHtml = "";
      row = modules.map((element, i) => {
        //console.log("modules", modules);
        let questions = this.state["allQuestions"].filter(
          (x) => x["Module"] == element
        );
        const groupSubmoduleData = questions.reduce(
          (groups, item) => ({
            ...groups,
            [item.SubModule]: [...(groups[item.SubModule] || []), item],
          }),
          {}
        );
        let subModules = Object.keys(groupSubmoduleData);
        //console.log("subModules", subModules);
        {
          return subModules.map((subModule, i) => {
            let finalquestions = questions.filter(
              (x) => x["SubModule"] == subModule
            );
            console.log("finalquestions", finalquestions);
            return (
              <div className="RD">
                {i == 0 && (
                  <div className="row mt10">
                    <div className={"col-md-3 " + styles.boldlabel}>
                      {element}
                    </div>
                  </div>
                )}

                {finalquestions.map((question, index) => {
                  /* Deva Changes Start */
                  return (
                    <div>
                      <div className="row mt15 mb10">
                        {index == 0 ? (
                          <div className={"col-md-3"}>
                            {question["SubModule"]}
                          </div>
                        ) : (
                          <div className={"col-md-3"} />
                        )}
                        <div className={"col-md-7"}>{question["Question"]}</div>
                        {question["CommentaryBoxRequired"] ? (
                          <>
                            <div className={"col-md-2 "} />
                            <div className="row">
                              <div className={"col-md-3 " + styles.boldlabel} />
                              <div className={"col-md-9 " + styles.boldlabel}>
                                {/* <label htmlFor="" className="blueLabel">
                                  Provide examples or describe areas for
                                  improvement (commentary required)
                                </label> */}
                                <textarea
                                  style={{ marginTop: "10px" }}
                                  placeholder=""
                                  value={
                                    this.state["Fields"][
                                      subModule + "Comments" + (index + 1)
                                    ]
                                  }
                                  onChange={(e: any) => {
                                    this.onEventChange(
                                      e.target.value,
                                      e.target.name + (index + 1)
                                    );
                                  }}
                                  rows={4}
                                  disabled={this.isDisabed}
                                  name={subModule + "Comments"}
                                />
                              </div>
                              <div className={"col-md-2 " + styles.boldlabel} />
                            </div>
                          </>
                        ) : (
                          <div className={"col-md-2 " + styles.boldlabel}>
                            <Dropdown
                              className={
                                this.isDisabed
                                  ? styles.RevieweeDropDownView
                                  : styles.RevieweeDropDownEdit
                              }
                              options={this.state["data"]}
                              value={
                                this.state["Fields"][
                                  question["SubModule"] + (index + 1)
                                ]
                              }
                              placeholder="Select Ratings"
                              disabled={this.isDisabed}
                              onChange={(e) => {
                                this.onRatingEventChange(
                                  e["value"],
                                  question["SubModule"] + (index + 1)
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                  /* Deva Changes End */

                  //   return (
                  //     <div>
                  //       <div className="row mt15 mb10">
                  //         {index == 0 ? (
                  //           <div className={"col-md-3"}>
                  //             {question["SubModule"]}
                  //           </div>
                  //         ) : (
                  //           <div className={"col-md-3"}></div>
                  //         )}
                  //         <div className={"col-md-7"}>{question["Question"]}</div>
                  //         <div className={"col-md-2 " + styles.boldlabel}>
                  //           {/* <RatingDropDown value={this.state["Fields"]["BQ1"]} name="BQ1" /> */}
                  //           <Dropdown
                  //             options={this.state["data"]}
                  //             value={
                  //               this.state["Fields"][
                  //                 question["SubModule"] + (index + 1)
                  //               ]
                  //             }
                  //             placeholder="Select Ratings"
                  //             disabled={this.isDisabed}
                  //             onChange={(e) =>
                  //               this.onRatingEventChange(
                  //                 e["value"],
                  //                 question["SubModule"] + (index + 1)
                  //               )
                  //             }
                  //           />
                  //         </div>
                  //       </div>
                  //       {index == finalquestions.length - 1 && (
                  //         <div className="row">
                  //           <div className={"col-md-3 " + styles.boldlabel}></div>
                  //           <div className={"col-md-9 " + styles.boldlabel}>
                  //             <label htmlFor="" className="blueLabel">
                  //               Provide examples or describe areas for improvement
                  //               (commentary required)
                  //             </label>
                  //             <textarea
                  //               placeholder=""
                  //               value={
                  //                 this.state["Fields"][subModule + "Comments"]
                  //               }
                  //               //value={this.state["Fields"]["RDComments"]}
                  //               onChange={this.onEventChange}
                  //               rows={4}
                  //               disabled={this.isDisabed}
                  //               name={subModule + "Comments"}
                  //             ></textarea>
                  //           </div>
                  //           <div className={"col-md-2 " + styles.boldlabel}></div>
                  //         </div>
                  //       )}
                  //     </div>
                  //   );
                })}
              </div>
            );
          });
        }
      });
      // modules.forEach(element => {
      //     rows.push("<div className='RD'><div className='row mt10'><div className={'col-md-3 ' + styles.boldlabel}>" +
      //         + element + "</div></div>");
      // });
      // rows.push(strHtml);
    }
    console.log("row", row);
    return <div className=""> {row}</div>;
  };

  public render(): React.ReactElement<any> {
    return (
      <div className={styles.anmNonEngagement}>
        <div className="mainContainer">
          <div className="row mt1">
            <div className="col-md-6">
              <div className="form-controls">
                {this.state["nonEngReviewData"].Role !== "Senior Associate" && (
                  <span>
                    {" "}
                    <label className={styles.boldlabel}>
                      Transaction Advisory Group
                    </label>
                    <br />
                  </span>
                )}
                <span className={styles.boldlabel}>
                  Non-engagement Review Form -{" "}
                  <span>{this.state["nonEngReviewData"].Role}</span>
                </span>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="form-controls pull-right">
                <label className={styles.boldlabel}>Name:</label>
                <label className="text-left">
                  {this.state["nonEngReviewData"]
                    ? this.state["nonEngReviewData"].RevieweeName
                      ? this.state["nonEngReviewData"].RevieweeName.Title
                      : ""
                    : ""}
                </label>
              </div>
            </div>
          </div>
          <div className="sectionContainer">
            <div className="headingtitlebar">Summary Information</div>
            <div className="subContainer">
              <div>
                <label>​FY YTD Utilization:</label>
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["FYYTDUtilization"]}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={1}
                  name="FYYTDUtilization"
                  disabled={this.isDisabed}
                ></textarea>
              </div>
              <div>
                <label>Summary of engagement-related strengths:</label>
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["SummaryOfStrengths"]}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={4}
                  name="SummaryOfStrengths"
                  disabled={this.isDisabed}
                ></textarea>
              </div>
              <div>
                <label>
                  Summary of engagement-related areas for improvement:
                </label>
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["SummaryOfImprovement"]}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={4}
                  name="SummaryOfImprovement"
                  disabled={this.isDisabed}
                ></textarea>
              </div>
              <div>
                <label>
                  Summary of progress in addressing prior year areas for
                  improvement:
                </label>
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["SummaryOfProgress"]}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={4}
                  name="SummaryOfProgress"
                  disabled={this.isDisabed}
                ></textarea>
              </div>
              <div>
                <label>Other Considerations:</label>
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["OtherConsiderations"]}
                  // onChange={this.onEventChange}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={4}
                  name="OtherConsiderations"
                  disabled={this.isDisabed}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="sectionContainer">
            <div className="headingtitlebar">
              Engagement Performance Summary
            </div>
            <div className="subContainer">
              <Projects
                userId={
                  this.state["nonEngReviewData"]["RevieweeName"]
                    ? this.state["nonEngReviewData"]["RevieweeName"]["Id"]
                    : ""
                }
                ItemID={this.props.ItemID}
                AppContext={this.props.AppContext}
              />
            </div>
          </div>
          <div className="sectionContainer">
            <div className="headingtitlebar">
              Non-Engagement Performance Summary
            </div>

            <div className="sectionContainer">
              <div className="titlebar">
                <span className={styles.boldlabel}>
                  Performance Rating Instructions:
                </span>
                <span>
                  {" "}
                  Rate each behavioral statement using the scale provided in the
                  drop-down field (scale definitions provided below)
                </span>
                <br />
                <div className={"mtb5 " + styles.boldlabel}>
                  4: Significantly exceeds expectations for level <br />
                  3: Proficient for level
                  <br />
                  2: Progressing toward expectations for level
                  <br />
                  1: Does not meet expectations for level <br />
                </div>
              </div>
              <div className="summaryContainer">
                <div className="row">
                  <div className={"col-md-3 " + styles.boldlabel}>
                    Competency
                  </div>
                  <div className={"col-md-7 " + styles.boldlabel}>
                    RDTA Behaviors
                  </div>
                  <div className={"col-md-2 " + styles.boldlabel}>
                    Proficiency
                  </div>
                </div>
                {this.createQuestionaire()}
                {/* <div className='RD'>
                                    <div className='row mt10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}>Business development</div>
                                    </div>
                                    <div className='row mt15 mb10'>
                                        <div className={'col-md-3'}>Relationship development</div>
                                        <div className={'col-md-7'}>
                                            Actively builds understanding of others' interests and constantly
                                            seeks opportunities to engage/connect on topics of interest</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RD1"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RD1")}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Plans and participates in social events with clients and potential clients,
                                            and proactively seeks opportunities to strengthen existing relationships</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RD2"]}
                                                disabled={this.isDisabed}
                                                placeholder="Select Ratings"
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RD2")}
                                            />

                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Coaches others to build and develop long-term relationships
                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RD3"]}
                                                data-name={this.props.name}
                                                disabled={this.isDisabed}
                                                placeholder="Select Ratings"
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RD3")}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Leverages existing network to identify and build relationships
                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RD4"]}
                                                data-name={this.props.name}
                                                disabled={this.isDisabed}
                                                placeholder="Select Ratings"
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RD4")}
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-9 ' + styles.boldlabel}>
                                            <label htmlFor="" className='blueLabel'>Provide examples or describe areas for improvement (commentary required)</label>
                                            <textarea
                                                placeholder=""
                                                value={this.state["Fields"]["RDComments"]}
                                                onChange={this.onEventChange}
                                                rows={4}
                                                disabled={this.isDisabed}
                                                name="RDComments"
                                            ></textarea>

                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}></div>
                                    </div>
                                </div>
                                <div className='BD'>

                                    <div className='row mt15 mb10'>
                                        <div className={'col-md-3'}>Relationship development</div>
                                        <div className={'col-md-7'}>
                                            Actively builds understanding of others' interests and constantly
                                            seeks opportunities to engage/connect on topics of interest</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                           
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["BQ1"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "BQ1")}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Plans and participates in social events with clients and potential clients,
                                            and proactively seeks opportunities to strengthen existing relationships</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["BQ2"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "BQ2")}
                                            />

                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Coaches others to build and develop long-term relationships
                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["BQ3"]}
                                                data-name={this.props.name}
                                                placeholder="Select Ratings"
                                                onChange={(e) => this.onRatingEventChange(e["value"], "BQ3")}
                                                disabled={this.isDisabed}
                                            />
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-9 ' + styles.boldlabel}>
                                            <label htmlFor="" className='blueLabel'>Provide examples or describe areas for improvement (commentary required)</label>
                                            <textarea
                                                placeholder=""
                                                value={this.state["Fields"]["BDComments"]}
                                                onChange={this.onEventChange}
                                                rows={4}
                                                name="BDComments"
                                                disabled={this.isDisabed}
                                            ></textarea>

                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}></div>
                                    </div>

                                </div>
                                <div className='PD'>
                                    <div className='row mt10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}>Practice operations and Leadership</div>
                                    </div>
                                    <div className='row mt15 mb10'>
                                        <div className={'col-md-3'}>Practice development</div>
                                        <div className={'col-md-7'}>
                                            Actively builds understanding of others' interests and constantly
                                            seeks opportunities to engage/connect on topics of interest</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                           
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["PD1"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "PD1")}

                                            />
                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Plans and participates in social events with clients and potential clients,
                                            and proactively seeks opportunities to strengthen existing relationships</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["PD2"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "PD2")}
                                            />

                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-9 ' + styles.boldlabel}>
                                            <label htmlFor="" className='blueLabel'>Provide examples or describe areas for improvement (commentary required)</label>
                                            <textarea
                                                placeholder=""
                                                value={this.state["Fields"]["PDComments"]}
                                                onChange={this.onEventChange}
                                                rows={4}
                                                name="PDComments"
                                                disabled={this.isDisabed}
                                            ></textarea>

                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}></div>
                                    </div>
                                </div>

                                <div className='RDTA'>
                                    <div className='row mt10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}>RDTA Development</div>
                                    </div>
                                    <div className='row mt15 mb10'>
                                        <div className={'col-md-3'}>Developing RDTA characteristics</div>
                                        <div className={'col-md-7'}>
                                            Actively participates in TAG trainings, including RDTA-specific trainings</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                           
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RDTAQ1"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RDTAQ1")}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Applies RDTA characteristics into the internal aspects of our practice</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RDTAQ2"]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RDTAQ2")}
                                            />

                                        </div>
                                    </div>
                                    <div className='row mb10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-7'}>
                                            Applies RDTA characteristics into the external aspects of our practice
                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"]["RDTAQ3"]}
                                                data-name={this.props.name}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], "RDTAQ3")}
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className={'col-md-3 ' + styles.boldlabel}></div>
                                        <div className={'col-md-9 ' + styles.boldlabel}>
                                            <label htmlFor="" className='blueLabel'>Provide examples or describe areas for improvement (commentary required)</label>
                                            <textarea
                                                placeholder=""
                                                value={this.state["Fields"]["RDTAComments"]}
                                                onChange={this.onEventChange}
                                                rows={4}
                                                name="RDTAComments"
                                                disabled={this.isDisabed}
                                            ></textarea>

                                        </div>
                                        <div className={'col-md-2 ' + styles.boldlabel}></div>
                                    </div>
                                </div> */}
              </div>
            </div>
          </div>
          {(this.statusReview == "Awaiting Acknowledgement" ||
            this.statusReview == "Acknowledged") && (
            <div className="row mt30 sectionContainer">
              <div className="titlebar mb10">
                <span className={styles.boldlabel}>
                  REVIEWEE ACKNOWLEDGEMENT COMMENTS
                </span>
                <span>(Comments are optional and visible)</span>
              </div>
              <div className="subContainer">
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["RAC"]}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={4}
                  name="RAC"
                  disabled={
                    this.statusReview == "Acknowledged" ||
                    this.state["isMentor"]
                  }
                ></textarea>
              </div>
            </div>
          )}
          {(this.state["isMentor"] || this.submmited == 5) && (
            <div className="row mt30 greysubContainer">
              <span className="col-md-3 mt30 fontWhite text-right">
                Optional Reversion Comment (visible)
              </span>
              <div className="col-md-6">
                <textarea
                  placeholder=""
                  value={this.state["Fields"]["ORC"]}
                  onChange={(e: any) => {
                    this.onEventChange(e.target.value, e.target.name);
                  }}
                  rows={4}
                  name="ORC"
                  disabled={this.statusReview !== "Awaiting Mentor"}
                />
              </div>
              <div className="col-md-3">
                {this.statusReview == "Awaiting Mentor" && (
                  <button
                    className="btn btn-primary w100 mt10"
                    onClick={() => this.saveData(5)}
                  >
                    Revert To Reviewee
                  </button>
                )}{" "}
              </div>
            </div>
          )}
          <div className="dflex mt30 jc row">
            {this.state["isMentor"] && (
              <div className="text-right">
                <div className="titlebar mb10">
                  <span className={styles.boldlabel}>Mentor: </span>
                  <span>
                    Review the form. Add any optional comments in the text area
                    above. When you are satisfied, click the Submit button
                    below. Alternatively, you could choose to revert to the
                    Reviewer for more changes. Complete the gray section below.
                  </span>
                </div>
                {this.statusReview == "Awaiting Mentor" && (
                  <div className="disib mt15 mb10">
                    <button
                      className="btn btn-primary"
                      onClick={() => this.saveData(0)}
                    >
                      Save Draft
                    </button>{" "}
                    <button
                      className="btn btn-secondary ml1"
                      style={{
                        cursor: "pointer",
                        background: "#49e90ad0",
                        border: '1px solid #002b49',
                        color: '#000'
                      }}
                      onClick={() => this.saveData(4)}
                    >
                      Submit To Reviewee For Acknowledgement
                    </button>
                  </div>
                )}
                <button
                  className="btn btn-outline-dark disib ml1 mr15"
                  onClick={() => this.cancel()}
                >
                  Close
                </button>
              </div>
            )}

            {this.state["isReviewee"] && (
              <div className="text-right">
                <div className="titlebar mb10">
                  <span className={styles.boldlabel}>Reviewee: </span>
                  <span>
                    When your comments are complete, click the Submit button
                    below. (Not ready yet? You can{" "}
                    <span className={styles.boldlabel}>Save Draft</span> to
                    preserve your inputs prior to submitting to the Mentor.)
                  </span>
                </div>

                {/* {(this.statusReview == "Awaiting Acknowledgement") ?
                                    <div className='disib text-right mt15 mb10'>
                                        <button className='btn btn-primary' onClick={() => this.saveData(0)}>Save Draft</button>
                                        <button className='btn btn-secondary ml1' onClick={() => this.saveData(6)}>Submit Final Review</button>
                                    </div> :
                                    (this.statusReview == "Awaiting Mentor" || this.statusReview == "Acknowledged") ? <div></div> :
                                        <div className='disib mt15 mb10'>
                                            <button className='btn btn-primary' onClick={() => this.saveData(0)}>Save Draft</button>
                                            <button className='btn btn-secondary ml1' onClick={() => this.saveData(3)}>Submit To Mentor For Approval</button>
                                            </div>
                                } */}
                {this.statusReview == "Awaiting Acknowledgement" && (
                  <div className="disib text-right mt15 mb10">
                    <button
                      className="btn btn-primary"
                      onClick={() => this.saveData(0)}
                    >
                      Save Draft
                    </button>
                    <button
                      className="btn btn-secondary ml1"
                      style={{
                        cursor: "pointer",
                        background: "#49e90ad0",
                        border: '1px solid #002b49',
                        color: '#000'
                      }}
                      onClick={() => this.saveData(6)}
                    >
                      Submit Final Review
                    </button>
                  </div>
                )}
                {this.statusReview == "Awaiting Reviewee" && (
                  <div className="disib mt15 mb10">
                    <button
                      className="btn btn-primary"
                      onClick={() => this.saveData(0)}
                    >
                      Save Draft
                    </button>
                    <button
                      className="btn btn-secondary ml1"
                      style={{
                        cursor: this.isRevieweeSubmit()
                          ? "pointer"
                          : "not-allowed",
                        background: this.isRevieweeSubmit()
                        ? "#49e90ad0"
                        : "#ff9",
                        border: '1px solid #002b49',
                        color: '#000'
                      }}
                      disabled={!this.isRevieweeSubmit()}
                      title={
                        this.isRevieweeSubmit()
                          ? ""
                          : "Please answer the all questions."
                      }
                      onClick={() => {
                        this.isRevieweeSubmit() ? this.saveData(3) : "";
                      }}
                    >
                      Submit To Mentor For Approval
                    </button>
                  </div>
                )}
                {/* {(this.statusReview == "Awaiting Mentor" || this.statusReview == "Acknowledged") &&
                                    <div className='disib mt15 mb10'>
                                        <button className='btn btn-primary' onClick={() => this.saveData(0)}>Save Draft</button>
                                        <button className='btn btn-secondary ml1' onClick={() => this.saveData(3)}>Submit To Mentor For Approval</button>
                                    </div>
                                } */}

                <button
                  className="btn btn-outline-dark ml1 disib mr15"
                  onClick={() => this.cancel()}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          {/* <textarea
                        placeholder=""
                        value={this.state["singOff"]}
                        onChange={this.onEventChange}
                        rows={4}
                        name="RDTAComments"
                        disabled={this.isDisabed}
                    ></textarea> */}
          <div className="sectionContainer">
            <div className="subContainer">
              <h5>Sign Off History</h5>
              {this.createSignOffHistory()}
            </div>
          </div>
        </div>
        <Dialog
          hidden={this.state["showModel"]}
          onDismiss={() => {
            this.setState({ showModel: true });
          }}
          dialogContentProps={dialogContentProps}
          // modalProps={modalProps}
        >
          <DialogFooter>
            <button
              className="btn btn-primary"
              onClick={() => this.showAssigneeForm()}
            >
              OK
            </button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  public createSignOffHistory = (): JSX.Element => {
    var rows = [];
    if (this.state["signOffHistory"]) {
      let sortedVersions = this.state["signOffHistory"]["results"].sort(
        this.compare
      );
      console.log("sortedVersions", sortedVersions);
      sortedVersions.forEach((element) => {
        let hisElement: any = new DOMParser().parseFromString(
          element.Signoff_x005f_x0020_x005f_History,
          "text/xml"
        );
        rows.push(
          <span className="disb">
            {" "}
            {hisElement.firstChild.firstChild.data}{" "}
          </span>
        );
      });
    }
    //this.setState({singOff:rows});

    return <div className="signoffhistory">{rows}</div>;
  };

  public cancel = () => {
    window.location.href =
      this.webUrl + "/Lists/" + Config.ListNames.NonEngReviewredirectUrl;
  };

  public compare = (a, b) => {
    if (a.owshiddenversion < b.owshiddenversion) {
      return -1;
    }
    if (a.owshiddenversion > b.owshiddenversion) {
      return 1;
    }
    return 0;
  };

  private saveDataJsom = async (type: any) => {
    const context: SP.ClientContext = new SP.ClientContext(
      "https://smarttechies.sharepoint.com/sites/tagperfmgmt"
    );
    var oList = context
      .get_web()
      .get_lists()
      .getByTitle("Non Engagement Review Template");

    let oListItem = oList.getItemById(this.state["ItemID"]);
    const columns = Config.NonEngagementReviewTemplateColumns;
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
    oListItem.set_item(columns.RDTAQ2, this.state["Fields"]["RDTAQ2"]);
    oListItem.set_item(columns.RDTAQ3, this.state["Fields"]["RDTAQ3"]);
    oListItem.set_item(
      columns.RDTAComments,
      this.state["Fields"]["RDTAComments"]
    );
    oListItem.set_item(
      columns.SummaryOfStrengths,
      this.state["Fields"]["SummaryOfStrengths"]
    );
    oListItem.set_item(
      columns.SummaryOfProgress,
      this.state["Fields"]["SummaryOfProgress"]
    );
    oListItem.set_item(
      columns.SummaryOfImprovement,
      this.state["Fields"]["SummaryOfImprovement"]
    );
    oListItem.set_item(
      columns.OtherConsiderations,
      this.state["Fields"]["OtherConsiderations"]
    );
    oListItem.set_item(columns.Submitted, type);
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
    oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);

    oListItem.set_item(columns.RDQ1, this.state["Fields"]["RD1"]);

    if (type == 3) {
      let d1 = Date.now();
      let d = new Date(d1);
      let formattedDate =
        d.getMonth() +
        1 +
        "/" +
        d.getDate() +
        "/" +
        d.getFullYear() +
        " " +
        (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) +
        ":" +
        d.getMinutes() +
        " " +
        (d.getHours() >= 12 ? "PM" : "AM");
      let historyComment =
        "Reviewee Submitted - " +
        this.state["nonEngReviewData"].RevieweeName.Title +
        " , " +
        formattedDate;
      oListItem.set_item(columns.SignoffHistory, historyComment);
      oListItem.set_item(columns.StatusReview, "Awaiting Mentor");
    }
    if (type == 0) {
      oListItem.set_item(columns.SignoffHistory, "");
    }
    if (type == 2) {
      oListItem.set_item(columns.RAC, this.state["Fields"]["RAC"]);
    }
    if (type == 5) {
      oListItem.set_item(columns.RAC, this.state["Fields"]["RAC"]);
      oListItem.set_item(columns.StatusReview, "Awaiting Reviewee");
    }
    if (type == 6) {
      oListItem.set_item(columns.StatusReview, "Acknowledged");
    }
    if (type == 4) {
      oListItem.set_item(columns.StatusReview, "Awaiting Reviewee");
    }

    oListItem.update();
    context.executeQueryAsync(
      (sender: any, args: SP.ClientRequestSucceededEventArgs): void => {
        //console.log("showModel", res);
        this.setState({ showModel: false });
      },
      (sender: any, args: SP.ClientRequestFailedEventArgs): void => {
        this.setState({
          loadingLists: false,
          listTitles: [],
          error: args.get_message(),
        });
        alert(
          "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
    );
  };

  private dateFormat = (date) => {
    const formatData = (input) => {
      if (input > 9) {
        return input;
      } else return `0${input}`;
    };

    // Function to convert
    // 24 Hour to 12 Hour clock
    const formatHour = (input) => {
      if (input > 12) {
        return input - 12;
      }
      return input;
    };

    let hrs = formatData(formatHour(date.getHours()));
    let MM = formatData(date.getMinutes());
    let pp = hrs > 12 ? "PM" : "AM";
    return (
      date.getMonth() +
      1 +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      " " +
      hrs +
      ":" +
      MM +
      " " +
      pp
    );
  };

  private saveData = async (type: any) => {
    console.log("Calling save", this.state["Fields"]);
    // let d1 = Date.now();
    // let d = new Date(d1);
    // let formattedDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + ':' + d.getMinutes() + ' ' + (d.getHours() >= 12 ? "PM" : "AM");
    let formattedDate = this.dateFormat(new Date());
    let data = {};
    const columns = Config.NonEngagementReviewTemplateColumns;

    data[columns.FYYTDUtilization] = this.state["Fields"]["FYYTDUtilization"];

    data[columns.RDQ1] = this.state["Fields"]["Relationship Development1"];
    data[columns.RDQ2] = this.state["Fields"]["Relationship Development2"];
    data[columns.RDQ3] = this.state["Fields"]["Relationship Development3"];
    data[columns.RDQ4] = this.state["Fields"]["Relationship Development4"];
    data[columns.RDQ5] = this.state["Fields"]["Relationship Development5"];
    data[columns.RDComments] =
      this.state["Fields"]["Relationship DevelopmentComments"];

    data[columns.BQ1] = this.state["Fields"]["Business Development1"];
    data[columns.BQ2] = this.state["Fields"]["Business Development2"];
    data[columns.BQ3] = this.state["Fields"]["Business Development3"];
    data[columns.BQ4] = this.state["Fields"]["Business Development4"];
    data[columns.BDComments] =
      this.state["Fields"]["Business DevelopmentComments"];

    data[columns.PD1] = this.state["Fields"]["Practice Development1"];
    data[columns.PD2] = this.state["Fields"]["Practice Development2"];
    data[columns.PD3] = this.state["Fields"]["Practice Development3"];
    data[columns.PD4] = this.state["Fields"]["Practice Development4"];
    data[columns.PDComments] =
      this.state["Fields"]["Practice DevelopmentComments"];

    data[columns.RDTAQ1] =
      this.state["Fields"]["Developing RDTA characteristics1"];
    data[columns.RDTAQ2] =
      this.state["Fields"]["Developing RDTA characteristics2"];
    data[columns.RDTAQ3] =
      this.state["Fields"]["Developing RDTA characteristics3"];
    data[columns.RDTAComments] =
      this.state["Fields"]["Developing RDTA characteristicsComments"];

    data[columns.SummaryOfStrengths] =
      this.state["Fields"]["SummaryOfStrengths"];
    data[columns.SummaryOfProgress] = this.state["Fields"]["SummaryOfProgress"];
    data[columns.SummaryOfImprovement] =
      this.state["Fields"]["SummaryOfImprovement"];
    data[columns.OtherConsiderations] =
      this.state["Fields"]["OtherConsiderations"];
    data[columns.Submitted] = type;
    data[columns.ORC] = this.state["Fields"]["ORC"];
    data[columns.RAC] = this.state["Fields"]["RAC"];

    /* Deva changes start */
    data[columns.BQ5] = this.state["Fields"]["Business Development5"];
    data[columns.BQ6] = this.state["Fields"]["Business Development6"];
    data[columns.BQ7] = this.state["Fields"]["Business Development7"];
    data[columns.BQ8] = this.state["Fields"]["Business Development8"];
    data[columns.BQ9] = this.state["Fields"]["Business Development9"];
    data[columns.BQ10] = this.state["Fields"]["Business Development10"];

    data[columns.RDQ6] = this.state["Fields"]["Relationship Development6"];
    data[columns.RDQ7] = this.state["Fields"]["Relationship Development7"];
    data[columns.RDQ8] = this.state["Fields"]["Relationship Development8"];
    data[columns.RDQ9] = this.state["Fields"]["Relationship Development9"];
    data[columns.RDQ10] = this.state["Fields"]["Relationship Development10"];

    data[columns.PD5] = this.state["Fields"]["Practice Development5"];
    data[columns.PD6] = this.state["Fields"]["Practice Development6"];
    data[columns.PD7] = this.state["Fields"]["Practice Development7"];
    data[columns.PD8] = this.state["Fields"]["Practice Development8"];
    data[columns.PD9] = this.state["Fields"]["Practice Development9"];
    data[columns.PD10] = this.state["Fields"]["Practice Development10"];

    data[columns.RDTAQ4] =
      this.state["Fields"]["Developing RDTA characteristics4"];
    data[columns.RDTAQ5] =
      this.state["Fields"]["Developing RDTA characteristics5"];
    data[columns.RDTAQ6] =
      this.state["Fields"]["Developing RDTA characteristics6"];
    data[columns.RDTAQ7] =
      this.state["Fields"]["Developing RDTA characteristics7"];
    data[columns.RDTAQ8] =
      this.state["Fields"]["Developing RDTA characteristics8"];
    data[columns.RDTAQ9] =
      this.state["Fields"]["Developing RDTA characteristics9"];
    data[columns.RDTAQ10] =
      this.state["Fields"]["Developing RDTA characteristics10"];

    data[columns.LC1] = this.state["Fields"]["Living Culture and Core Values1"];
    data[columns.LC2] = this.state["Fields"]["Living Culture and Core Values2"];
    data[columns.LC3] = this.state["Fields"]["Living Culture and Core Values3"];
    data[columns.LC4] = this.state["Fields"]["Living Culture and Core Values4"];
    data[columns.LC5] = this.state["Fields"]["Living Culture and Core Values5"];
    data[columns.LC6] = this.state["Fields"]["Living Culture and Core Values6"];
    data[columns.LC7] = this.state["Fields"]["Living Culture and Core Values7"];
    data[columns.LC8] = this.state["Fields"]["Living Culture and Core Values8"];
    data[columns.LC9] = this.state["Fields"]["Living Culture and Core Values9"];
    data[columns.LC10] =
      this.state["Fields"]["Living Culture and Core Values10"];

    data[columns.PO1] = this.state["Fields"]["Practice Operations1"];
    data[columns.PO2] = this.state["Fields"]["Practice Operations2"];
    data[columns.PO3] = this.state["Fields"]["Practice Operations3"];
    data[columns.PO4] = this.state["Fields"]["Practice Operations4"];
    data[columns.PO5] = this.state["Fields"]["Practice Operations5"];
    data[columns.PO6] = this.state["Fields"]["Practice Operations6"];
    data[columns.PO7] = this.state["Fields"]["Practice Operations7"];
    data[columns.PO8] = this.state["Fields"]["Practice Operations8"];
    data[columns.PO9] = this.state["Fields"]["Practice Operations9"];
    data[columns.PO10] = this.state["Fields"]["Practice Operations10"];

    data[columns.RDCQ1] =
      this.state["Fields"]["Relationship Development Comments1"];
    data[columns.RDCQ2] =
      this.state["Fields"]["Relationship Development Comments2"];
    data[columns.RDCQ3] =
      this.state["Fields"]["Relationship Development Comments3"];
    data[columns.RDCQ4] =
      this.state["Fields"]["Relationship Development Comments4"];
    data[columns.RDCQ5] =
      this.state["Fields"]["Relationship Development Comments5"];
    data[columns.RDCQ6] =
      this.state["Fields"]["Relationship Development Comments6"];
    data[columns.RDCQ7] =
      this.state["Fields"]["Relationship Development Comments7"];
    data[columns.RDCQ8] =
      this.state["Fields"]["Relationship Development Comments8"];
    data[columns.RDCQ9] =
      this.state["Fields"]["Relationship Development Comments9"];
    data[columns.RDCQ10] =
      this.state["Fields"]["Relationship Development Comments10"];

    data[columns.BDComments1] =
      this.state["Fields"]["Business DevelopmentComments1"];
    data[columns.BDComments2] =
      this.state["Fields"]["Business DevelopmentComments2"];
    data[columns.BDComments3] =
      this.state["Fields"]["Business DevelopmentComments3"];
    data[columns.BDComments4] =
      this.state["Fields"]["Business DevelopmentComments4"];
    data[columns.BDComments5] =
      this.state["Fields"]["Business DevelopmentComments5"];
    data[columns.BDComments6] =
      this.state["Fields"]["Business DevelopmentComments6"];
    data[columns.BDComments7] =
      this.state["Fields"]["Business DevelopmentComments7"];
    data[columns.BDComments8] =
      this.state["Fields"]["Business DevelopmentComments8"];
    data[columns.BDComments9] =
      this.state["Fields"]["Business DevelopmentComments9"];
    data[columns.BDComments10] =
      this.state["Fields"]["Business DevelopmentComments10"];

    data[columns.RDComments1] =
      this.state["Fields"]["Relationship DevelopmentComments1"];
    data[columns.RDComments2] =
      this.state["Fields"]["Relationship DevelopmentComments2"];
    data[columns.RDComments3] =
      this.state["Fields"]["Relationship DevelopmentComments3"];
    data[columns.RDComments4] =
      this.state["Fields"]["Relationship DevelopmentComments4"];
    data[columns.RDComments5] =
      this.state["Fields"]["Relationship DevelopmentComments5"];
    data[columns.RDComments6] =
      this.state["Fields"]["Relationship DevelopmentComments6"];
    data[columns.RDComments7] =
      this.state["Fields"]["Relationship DevelopmentComments7"];
    data[columns.RDComments8] =
      this.state["Fields"]["Relationship DevelopmentComments8"];
    data[columns.RDComments9] =
      this.state["Fields"]["Relationship DevelopmentComments9"];
    data[columns.RDComments10] =
      this.state["Fields"]["Relationship DevelopmentComments10"];

    data[columns.PDComments1] =
      this.state["Fields"]["Practice DevelopmentComments1"];
    data[columns.PDComments2] =
      this.state["Fields"]["Practice DevelopmentComments2"];
    data[columns.PDComments3] =
      this.state["Fields"]["Practice DevelopmentComments3"];
    data[columns.PDComments4] =
      this.state["Fields"]["Practice DevelopmentComments4"];
    data[columns.PDComments5] =
      this.state["Fields"]["Practice DevelopmentComments5"];
    data[columns.PDComments6] =
      this.state["Fields"]["Practice DevelopmentComments6"];
    data[columns.PDComments7] =
      this.state["Fields"]["Practice DevelopmentComments7"];
    data[columns.PDComments8] =
      this.state["Fields"]["Practice DevelopmentComments8"];
    data[columns.PDComments9] =
      this.state["Fields"]["Practice DevelopmentComments9"];
    data[columns.PDComments10] =
      this.state["Fields"]["Practice DevelopmentComments10"];

    data[columns.RDTAComments1] =
      this.state["Fields"]["Developing RDTA characteristicsComments1"];
    data[columns.RDTAComments2] =
      this.state["Fields"]["Developing RDTA characteristicsComments2"];
    data[columns.RDTAComments3] =
      this.state["Fields"]["Developing RDTA characteristicsComments3"];
    data[columns.RDTAComments4] =
      this.state["Fields"]["Developing RDTA characteristicsComments4"];
    data[columns.RDTAComments5] =
      this.state["Fields"]["Developing RDTA characteristicsComments5"];
    data[columns.RDTAComments6] =
      this.state["Fields"]["Developing RDTA characteristicsComments6"];
    data[columns.RDTAComments7] =
      this.state["Fields"]["Developing RDTA characteristicsComments7"];
    data[columns.RDTAComments8] =
      this.state["Fields"]["Developing RDTA characteristicsComments8"];
    data[columns.RDTAComments9] =
      this.state["Fields"]["Developing RDTA characteristicsComments9"];
    data[columns.RDTAComments10] =
      this.state["Fields"]["Developing RDTA characteristicsComments10"];

    data[columns.LCComments1] =
      this.state["Fields"]["Living Culture and Core ValuesComments1"];
    data[columns.LCComments2] =
      this.state["Fields"]["Living Culture and Core ValuesComments2"];
    data[columns.LCComments3] =
      this.state["Fields"]["Living Culture and Core ValuesComments3"];
    data[columns.LCComments4] =
      this.state["Fields"]["Living Culture and Core ValuesComments4"];
    data[columns.LCComments5] =
      this.state["Fields"]["Living Culture and Core ValuesComments5"];
    data[columns.LCComments6] =
      this.state["Fields"]["Living Culture and Core ValuesComments6"];
    data[columns.LCComments7] =
      this.state["Fields"]["Living Culture and Core ValuesComments7"];
    data[columns.LCComments8] =
      this.state["Fields"]["Living Culture and Core ValuesComments8"];
    data[columns.LCComments9] =
      this.state["Fields"]["Living Culture and Core ValuesComments9"];
    data[columns.LCComments10] =
      this.state["Fields"]["Living Culture and Core ValuesComments10"];

    data[columns.POComments1] =
      this.state["Fields"]["Practice OperationsComments1"];
    data[columns.POComments2] =
      this.state["Fields"]["Practice OperationsComments2"];
    data[columns.POComments3] =
      this.state["Fields"]["Practice OperationsComments3"];
    data[columns.POComments4] =
      this.state["Fields"]["Practice OperationsComments4"];
    data[columns.POComments5] =
      this.state["Fields"]["Practice OperationsComments5"];
    data[columns.POComments6] =
      this.state["Fields"]["Practice OperationsComments6"];
    data[columns.POComments7] =
      this.state["Fields"]["Practice OperationsComments7"];
    data[columns.POComments8] =
      this.state["Fields"]["Practice OperationsComments8"];
    data[columns.POComments9] =
      this.state["Fields"]["Practice OperationsComments9"];
    data[columns.POComments10] =
      this.state["Fields"]["Practice OperationsComments10"];

    data[columns.RDCComments1] =
      this.state["Fields"]["Relationship Development CommentsComments1"];
    data[columns.RDCComments2] =
      this.state["Fields"]["Relationship Development CommentsComments2"];
    data[columns.RDCComments3] =
      this.state["Fields"]["Relationship Development CommentsComments3"];
    data[columns.RDCComments4] =
      this.state["Fields"]["Relationship Development CommentsComments4"];
    data[columns.RDCComments5] =
      this.state["Fields"]["Relationship Development CommentsComments5"];
    data[columns.RDCComments6] =
      this.state["Fields"]["Relationship Development CommentsComments6"];
    data[columns.RDCComments7] =
      this.state["Fields"]["Relationship Development CommentsComments7"];
    data[columns.RDCComments8] =
      this.state["Fields"]["Relationship Development CommentsComments8"];
    data[columns.RDCComments9] =
      this.state["Fields"]["Relationship Development CommentsComments9"];
    data[columns.RDCComments10] =
      this.state["Fields"]["Relationship Development CommentsComments10"];
    /* Deva changes end */

    debugger;
    if (type == 3) {
      data[columns.SignoffHistory] =
        "Reviewee Submitted - " +
        this.state["nonEngReviewData"].RevieweeName.Title +
        " , " +
        formattedDate;
      data[columns.StatusReview] = "Awaiting Mentor";
      data[columns.Submitted] = type;
    }
    if (type == 0) {
      data[columns.SignoffHistory] = "";
      // data[columns.Submitted] = type;
    }

    if (type == 5) {
      data[columns.Submitted] = type;

      data[columns.StatusReview] = "Awaiting Reviewee";
      let comments = this.state["Fields"]["ORC"]
        ? " | Comments: " + this.state["Fields"]["ORC"]
        : "";
      data[columns.SignoffHistory] =
        "Review Reverted - " +
        this.state["nonEngReviewData"].Mentor.Title +
        " , " +
        formattedDate +
        comments;
    }
    if (type == 6) {
      data[columns.Submitted] = type;

      data[columns.StatusReview] = "Acknowledged";
      let comments = this.state["Fields"]["RAC"]
        ? " | Comments: " + this.state["Fields"]["RAC"]
        : "";
      data[columns.SignoffHistory] =
        "Acknowledged - " +
        this.state["nonEngReviewData"].RevieweeName.Title +
        " , " +
        formattedDate +
        comments;
    }
    if (type == 4) {
      data[columns.Submitted] = type;
      data[columns.StatusReview] = "Awaiting Acknowledgement";
      data[columns.SignoffHistory] =
        "Mentor Approved - " +
        this.state["nonEngReviewData"].Mentor.Title +
        " , " +
        formattedDate;
    }
    console.log(data);
    this.listItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.NonEngReview
    );

    this.listItemService.updateItem(this.state["ItemID"], data).then((res) => {
      //alert(res);
      console.log("showModel", res);
      this.setState({ newItemResponse: res.data });
      this.showAssigneeForm();
    });
  };

  private showAssigneeForm = () => {
    //this.setState({ showModel: true });
    //window.location.href = this.redirectURL;
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
  };
}
