import * as React from 'react';
import styles from '../AnmNonEngagement.module.scss';
import { IAnmNonEngagementProps } from '../IAnmNonEngagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ListItemService from "../../../../services/ListItemService";
import UserService from "../../../../services/UserService";
import { Config } from "../../../../globals/Config";
import { Enums } from "../../../../globals/Enums";
import { User } from "../../../../domain/models/types/User";
import MapResult from "../../../../domain/mappers/MapResult";
import { TAG_GenericDetails } from '../../../../domain/models/TAG_EmployeeDetails';
import 'react-dropdown/style.css';
import Dialog, { DialogFooter, DialogType, } from 'office-ui-fabric-react/lib/Dialog';
import { TAG_NonEngReviewSummary } from '../../../../domain/models/TAG_NonEngReviewSummary';
import { TAG_Projects } from '../../../../domain/models/TAG_Projects';
import Projects from '../Projects/Projects';
import RatingDropDown from '../Common/RatingDropDown';
import Dropdown from 'react-dropdown';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { sp } from "@pnp/sp";
import "@pnp/sp/items";
import "@pnp/sp/webs";
const dialogContentProps = {
    type: DialogType.normal,
    title: 'Confirmation',
    subText: 'Data saved successfully.',
};

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
            selectedFYYear: '',
            selectedRole: '',
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
            singOff: ''

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
            itemId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        }
        else {
            itemId = this.props.ItemID;
        }
        this.setState({ ItemID: parseInt(itemId) });
        console.log('props reviewform', this.props);

        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.NonEngReview);

        const nonEngReviewData: TAG_NonEngReviewSummary = await this.listItemService.getItemUsingCAML(parseInt(itemId),
            [Config.NonEngagementReviewTemplateColumns.FiscalYear,
            Config.NonEngagementReviewTemplateColumns.Role, Config.NonEngagementReviewTemplateColumns.RevieweeName,
            Config.NonEngagementReviewTemplateColumns.Mentor, Config.NonEngagementReviewTemplateColumns.SignoffHistory
                , Config.NonEngagementReviewTemplateColumns.StatusReview, Config.NonEngagementReviewTemplateColumns.Submitted
                , Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths, Config.NonEngagementReviewTemplateColumns.SummaryOfImprovement
                , Config.NonEngagementReviewTemplateColumns.SummaryOfProgress,
            Config.NonEngagementReviewTemplateColumns.OtherConsiderations
                , Config.NonEngagementReviewTemplateColumns.RDTAQ1
                , Config.NonEngagementReviewTemplateColumns.RDTAQ2
                , Config.NonEngagementReviewTemplateColumns.RDTAQ3
                , Config.NonEngagementReviewTemplateColumns.RDTAComments
                , Config.NonEngagementReviewTemplateColumns.RAC
                , Config.NonEngagementReviewTemplateColumns.ORC
                , Config.NonEngagementReviewTemplateColumns.FYYTDUtilization,
                , Config.NonEngagementReviewTemplateColumns.RDComments
                , Config.NonEngagementReviewTemplateColumns.PDComments
                , Config.NonEngagementReviewTemplateColumns.BDComments
                , Config.NonEngagementReviewTemplateColumns.GetRDQ1
                , Config.NonEngagementReviewTemplateColumns.GetRDQ2
                , Config.NonEngagementReviewTemplateColumns.GetRDQ3
                , Config.NonEngagementReviewTemplateColumns.GetRDQ4
                , Config.NonEngagementReviewTemplateColumns.GetRDQ5
                , Config.NonEngagementReviewTemplateColumns.GetBQ1
                , Config.NonEngagementReviewTemplateColumns.GetBQ2
                , Config.NonEngagementReviewTemplateColumns.GetBQ3
                , Config.NonEngagementReviewTemplateColumns.GetBQ4
                , Config.NonEngagementReviewTemplateColumns.GetPD1
                , Config.NonEngagementReviewTemplateColumns.GetPD2
                , Config.NonEngagementReviewTemplateColumns.GetPD3
                , Config.NonEngagementReviewTemplateColumns.GetPD4
            ],
            undefined,
            Enums.ItemResultType.TAG_NonEngReviewSummary);
        console.log("nonEngReviewData", nonEngReviewData);
        this.setState({ "isReviweeDisabled": nonEngReviewData[Config.NonEngagementReviewTemplateColumns.StatusReview] == "Awaiting Reviewee" ? false : true });
        console.log("nonEngReviewData", nonEngReviewData);
        this.submmited = nonEngReviewData[Config.NonEngagementReviewTemplateColumns.Submitted];
        this.statusReview = nonEngReviewData["StatusReview"];
        this.checkCurrentUserType(nonEngReviewData);
        this.setDefaultValue(nonEngReviewData);
        this.listItemService.getAllVersion(parseInt(itemId), Config.ListNames.NonEngReview).then((res) => {
            console.log("Version History..", res);
            if (res)
                this.setState({ signOffHistory: res.Versions });
        });

        this.listItemService.getAllFilteresData(Config.ListNames.Questionnaire
            , nonEngReviewData[Config.NonEngagementReviewTemplateColumns.Role]).then((res) => {
                console.log("Questionaire..", res);
                if (res)
                    this.setState({ allQuestions: res });
            });
        const camlFilterConditions = "<Where><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE' /><Value Type='Lookup'>" + nonEngReviewData.RevieweeName.Id + "</Value></Eq></Where>";
        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.Projects);
        const allProjects: TAG_Projects[] =
            await this.listItemService.getItemsUsingCAML([Config.ProjectListColumns.ProjectName,
            Config.ProjectListColumns.HoursWorked, Config.ProjectListColumns.ReviewerName,
            Config.ProjectListColumns.ClientName
            ],
                'Id',
                camlFilterConditions, 100, Enums.ItemResultType.TAG_Projects);

        //console.log("allProjects", allProjects);
        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.Mentor);
        //const mentor: User = await this.listItemService.GetMentorOfEmployee(this.props.user);
        this.setState({
            nonEngReviewData: nonEngReviewData,
            currentuser: this.props.user
        });

    }
    public checkCurrentUserType = async (data) => {
        this.userService = new UserService(this.props.AppContext);
        let expectedCurrentUser: User = await this.userService.GetCurrentUser();
        if (expectedCurrentUser.Id ==
            data["RevieweeName"]["Id"]) {
            this.setState({ isReviewee: true });
            this.isDisabed = this.statusReview == "Awaiting Mentor" || this.statusReview == "Awaiting Acknowledgement" || this.statusReview == "Acknowledged";
            this.setState({ isMentor: false });
            this.redirectURL = this.webUrl + "/SitePages/Reviewee.aspx";
            console.log("User Is revieww");
        }
        else if (expectedCurrentUser.Id ==
            data["Mentor"]["Id"]) {
            this.setState({ isMentor: true });
            this.setState({ isReviewee: false });
            this.isDisabed = this.statusReview !== "Awaiting Mentor";
            this.redirectURL = this.webUrl + "/SitePages/Reviewer.aspx";
            console.log("User Is Mentor");
        }
        else {
            console.log("No Access");
        }

    }
    public setDefaultValue = (data) => {
        console.log("data", data);
        let fields = this.state["Fields"];
        fields[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths] = data[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths];
        fields["SummaryOfStrengths"] = data[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths];
        fields["SummaryOfImprovement"] = data[Config.NonEngagementReviewTemplateColumns.SummaryOfImprovement];
        fields["SummaryOfProgress"] = data[Config.NonEngagementReviewTemplateColumns.SummaryOfProgress];
        fields["OtherConsiderations"] = data[Config.NonEngagementReviewTemplateColumns.OtherConsiderations];

        fields["RAC"] = data["RAC"];
        fields["ORC"] = data["ORC"];
        fields[Config.NonEngagementReviewTemplateColumns.FYYTDUtilization] = data[Config.NonEngagementReviewTemplateColumns.FYYTDUtilization];

        fields["Relationship development1"] = data[Config.NonEngagementReviewTemplateColumns.GetRDQ1];
        fields["Relationship development2"] = data[Config.NonEngagementReviewTemplateColumns.GetRDQ2];
        fields["Relationship development3"] = data[Config.NonEngagementReviewTemplateColumns.GetRDQ3];
        fields["Relationship development4"] = data[Config.NonEngagementReviewTemplateColumns.GetRDQ4];
        fields["Relationship development5"] = data[Config.NonEngagementReviewTemplateColumns.GetRDQ5];
        fields["Relationship developmentComments"] = data[Config.NonEngagementReviewTemplateColumns.RDComments];

        fields["Business development1"] = data[Config.NonEngagementReviewTemplateColumns.GetBQ1];
        fields["Business development2"] = data[Config.NonEngagementReviewTemplateColumns.GetBQ2];
        fields["Business development3"] = data[Config.NonEngagementReviewTemplateColumns.GetBQ3];
        fields["Business development4"] = data[Config.NonEngagementReviewTemplateColumns.GetBQ4];
        fields["Business developmentComments"] = data[Config.NonEngagementReviewTemplateColumns.BDComments];

        fields["Practice development1"] = data[Config.NonEngagementReviewTemplateColumns.GetPD1];
        fields["Practice development2"] = data[Config.NonEngagementReviewTemplateColumns.GetPD2];
        fields["Practice development3"] = data[Config.NonEngagementReviewTemplateColumns.GetPD3];
        fields["Practice development4"] = data[Config.NonEngagementReviewTemplateColumns.GetPD4];
        fields["Practice developmentComments"] = data[Config.NonEngagementReviewTemplateColumns.PDComments];

        fields["Developing RDTA characteristics1"] = data[Config.NonEngagementReviewTemplateColumns.RDTAQ1];
        fields["Developing RDTA characteristics2"] = data[Config.NonEngagementReviewTemplateColumns.RDTAQ2];
        fields["Developing RDTA characteristics3"] = data[Config.NonEngagementReviewTemplateColumns.RDTAQ3];
        fields["Developing RDTA characteristicsComments"] = data[Config.NonEngagementReviewTemplateColumns.RDTAComments];

        // fields["BQ3"] =  data[Config.NonEngagementReviewTemplateColumns.GetBQ3];
        // fields["BQ4"] =  data[Config.NonEngagementReviewTemplateColumns.GetBQ4];
        this.setState({ Fields: fields });
        console.log(this.state["Fields"]);

    }
    public onEventChange = (event) => {
        console.log(event.target.value);
        let value = event.target.value;
        let fields = this.state["Fields"];
        fields[event.target.name] = value;
        this.setState({ Fields: fields });
        console.log(this.state["Fields"]);
    }
    public onRatingEventChange = (value, name) => {
        console.log("Rating", value, name);
        let fields = this.state["Fields"];
        fields[name] = value;
        this.setState({ Fields: fields });
        console.log(this.state["Fields"]);
    }
    public createQuestionaire = (): JSX.Element => {
        var rows = [];
        let row = [];
        if (this.state["allQuestions"]) {
            const groupData = this.state["allQuestions"].reduce((groups, item) => ({
                ...groups,
                [item.Module]: [...(groups[item.Module] || []), item]
            }), {});
            let modules = Object.keys(groupData);
            // console.log("modules", groupData, modules);
            let strHtml = "";
            row = modules.map((element, i) => {
                //console.log("modules", modules);
                let questions = this.state["allQuestions"].filter(x => x["Module"] == element);
                const groupSubmoduleData = questions.reduce((groups, item) => ({
                    ...groups,
                    [item.SubModule]: [...(groups[item.SubModule] || []), item]
                }), {});
                let subModules = Object.keys(groupSubmoduleData);
                //console.log("subModules", subModules);
                {
                    return subModules.map((subModule, i) => {
                        let finalquestions = questions.filter(x => x["SubModule"] == subModule);
                        console.log("finalquestions", finalquestions);
                        return (
                            <div className='RD'>
                                {i == 0 &&
                                    <div className='row mt10'>
                                        <div className={'col-md-3 ' + styles.boldlabel}>
                                            {element}
                                        </div></div>
                                }

                                {finalquestions.map((question, index) => {
                                    return (<div><div className='row mt15 mb10'>
                                        {index == 0 ?
                                            <div className={'col-md-3'}>{question["SubModule"]}</div> : <div className={'col-md-3'}></div>
                                        }
                                        <div className={'col-md-7'}>
                                            {question["Question"]}</div>
                                        <div className={'col-md-2 ' + styles.boldlabel}>
                                            {/* <RatingDropDown value={this.state["Fields"]["BQ1"]} name="BQ1" /> */}
                                            <Dropdown options={this.state["data"]}
                                                value={this.state["Fields"][question["SubModule"] + (index + 1)]}
                                                placeholder="Select Ratings"
                                                disabled={this.isDisabed}
                                                onChange={(e) => this.onRatingEventChange(e["value"], question["SubModule"] + (index + 1))}
                                            />
                                        </div>
                                    </div>
                                        {
                                            index == finalquestions.length - 1 &&
                                            <div className='row'>
                                                <div className={'col-md-3 ' + styles.boldlabel}></div>
                                                <div className={'col-md-9 ' + styles.boldlabel}>
                                                    <label htmlFor="" className='blueLabel'>
                                                        Provide examples or describe areas for improvement (commentary required)</label>
                                                    <textarea
                                                        placeholder=""
                                                        value={this.state["Fields"][subModule + "Comments"]}
                                                        //value={this.state["Fields"]["RDComments"]}
                                                        onChange={this.onEventChange}
                                                        rows={4}
                                                        disabled={this.isDisabed}
                                                        name={(subModule + "Comments")}
                                                    ></textarea>

                                                </div>
                                                <div className={'col-md-2 ' + styles.boldlabel}></div>
                                            </div>
                                        }

                                    </div>);

                                })
                                }


                            </div >
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
        return (<div className='' > {row}</div>);
    }
    public render(): React.ReactElement<any> {

        return (
            <div className={styles.anmNonEngagement} >

                <div className='mainContainer'>

                    <div className='row mt1'>
                        <div className='col-md-6'>
                            <div className='form-controls'>
                                {this.state["nonEngReviewData"].Role !== "Senior Associate" &&
                                    <span> <label className={styles.boldlabel}>Transaction Advisory Group
                                    </label><br /></span>
                                }
                                <span className={styles.boldlabel}>
                                    Non-engagement Review Form - <span>{this.state["nonEngReviewData"].Role}</span></span>
                            </div>
                        </div>
                        <div className='col-md-6 '>
                            <div className='form-controls pull-right'>
                                <label className={styles.boldlabel}>Name:</label>
                                <label className='text-left'>{this.state["nonEngReviewData"] ?
                                    this.state["nonEngReviewData"].RevieweeName ? this.state["nonEngReviewData"].RevieweeName.Title : '' : ''}</label></div>
                        </div>
                    </div>
                    <div className='sectionContainer'>
                        <div className='headingtitlebar'>
                            Summary Information
                        </div>
                        <div className='subContainer'>
                            <div>
                                <label>​FY YTD Utilization:</label>
                                <textarea
                                    placeholder=""
                                    value={this.state["Fields"]["FYYTDUtilization"]}
                                    onChange={this.onEventChange}
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
                                    onChange={this.onEventChange}
                                    rows={4}
                                    name="SummaryOfStrengths"
                                    disabled={this.isDisabed}
                                ></textarea>
                            </div>
                            <div>
                                <label>Summary of engagement-related areas for improvement:</label>
                                <textarea
                                    placeholder=""
                                    value={this.state["Fields"]["SummaryOfImprovement"]}
                                    onChange={this.onEventChange}
                                    rows={4}
                                    name="SummaryOfImprovement"
                                    disabled={this.isDisabed}
                                ></textarea>
                            </div>
                            <div>
                                <label>Summary of progress in addressing prior year areas for improvement:</label>
                                <textarea
                                    placeholder=""
                                    value={this.state["Fields"]["SummaryOfProgress"]}
                                    onChange={this.onEventChange}
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
                                    onChange={this.onEventChange}
                                    rows={4}
                                    name="OtherConsiderations"
                                    disabled={this.isDisabed}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className='sectionContainer'>
                        <div className='headingtitlebar'>
                            Engagement Performance Summary
                        </div>
                        <div className='subContainer'>
                            <Projects userId={this.state["nonEngReviewData"]["RevieweeName"] ? this.state["nonEngReviewData"]["RevieweeName"]["Id"] : ""}
                                ItemID={this.props.ItemID} AppContext={this.props.AppContext} />
                        </div>
                    </div>
                    <div className='sectionContainer'>
                        <div className='headingtitlebar'>
                            Non-engagement Performance Summary
                        </div>

                        <div className='sectionContainer'>

                            <div className='titlebar'>
                                <span className={styles.boldlabel}>Performance Rating Instructions:</span>
                                <span> Rate each behavioral statement using the scale provided in the drop-down
                                    field (scale definitions provided below)</span><br />
                                <div className={'mtb5 ' + styles.boldlabel}>
                                    4: Significantly exceeds expectations for level <br />
                                    3: Proficient for level<br />
                                    2: Progressing toward expectations for level<br />
                                    1: Does not meet expectations for level <br />
                                </div>
                            </div>
                            <div className='summaryContainer'>

                                <div className='row'>
                                    <div className={'col-md-3 ' + styles.boldlabel}>Competency</div>
                                    <div className={'col-md-7 ' + styles.boldlabel}>Behaviors</div>
                                    <div className={'col-md-2 ' + styles.boldlabel}>Proficiency</div>

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
                    {(this.statusReview == "Awaiting Acknowledgement" || this.statusReview == "Acknowledged") &&
                        <div className='row mt30 sectionContainer'>
                            <div className='titlebar mb10'>
                                <span className={styles.boldlabel}>REVIEWEE ACKNOWLEDGEMENT COMMENTS</span>
                                <span>(Comments are optional and visible)</span></div>
                            <div className='subContainer'>
                                <textarea
                                    placeholder=""
                                    value={this.state["Fields"]["RAC"]}
                                    onChange={this.onEventChange}
                                    rows={4}
                                    name="RAC"
                                    disabled={this.statusReview == "Acknowledged" || this.state["isMentor"]}
                                ></textarea></div>
                        </div>
                    }
                    {(this.state["isMentor"] || this.submmited == 5) &&
                        <div className='row mt30 greysubContainer'>


                            <span className='col-md-3 mt30 fontWhite text-right'>Optional Reversion Comment (visible)</span>
                            <div className='col-md-6'>
                                <textarea
                                    placeholder=""
                                    value={this.state["Fields"]["ORC"]}
                                    onChange={this.onEventChange}
                                    rows={4}
                                    name="ORC"
                                    disabled={this.statusReview !== "Awaiting Mentor"}
                                />
                            </div><div className='col-md-3'>
                                {this.statusReview == "Awaiting Mentor" && <button className='btn btn-primary w100 mt10'
                                    onClick={() => this.saveData(5)}
                                >Revert To Reviewee</button>}  </div></div>

                    }
                    <div className='dflex mt30 jc row'>
                        {(this.state["isMentor"]) &&
                            <div className='text-right'>
                                <div className='titlebar mb10'>
                                    <span className={styles.boldlabel}>Mentor: </span>
                                    <span>Review the form. Add any optional comments in the text area above.
                                        When you are satisfied, click the Submit button below. Alternatively,
                                        you could choose to revert to the Reviewer for more changes.
                                        Complete the gray
                                        section below.</span></div>
                                {(this.statusReview == "Awaiting Mentor") &&
                                    <div className='disib mt15 mb10'><button className='btn btn-primary'
                                        onClick={() => this.saveData(0)}
                                    >Save Draft</button>  <button className='btn btn-secondary ml1'
                                        onClick={() => this.saveData(4)}>
                                            Submit To Reviewee For Acknowledgement</button></div>
                                }
                                <button className='btn btn-outline-dark disib ml1 mr15' onClick={() => this.cancel()}>Close</button>
                            </div>

                        }

                        {(this.state["isReviewee"]) &&
                            <div className='text-right'>
                                <div className='titlebar mb10'>
                                    <span className={styles.boldlabel}>Reviewee: </span>
                                    <span>When your comments are complete, click the Submit button below.
                                        (Not ready yet? You can <span className={styles.boldlabel}>Save Draft</span> to preserve your inputs
                                        prior to submitting
                                        to the Mentor.)</span></div>

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
                                {(this.statusReview == "Awaiting Acknowledgement") &&
                                    <div className='disib text-right mt15 mb10'>
                                        <button className='btn btn-primary' onClick={() => this.saveData(0)}>Save Draft</button>
                                        <button className='btn btn-secondary ml1' onClick={() => this.saveData(6)}>Submit Final Review</button>
                                    </div>
                                }
                                {(this.statusReview == "Awaiting Reviewee") &&
                                    <div className='disib mt15 mb10'>
                                        <button className='btn btn-primary' onClick={() => this.saveData(0)}>Save Draft</button>
                                        <button className='btn btn-secondary ml1' onClick={() => this.saveData(3)}>Submit To Mentor For Approval</button>
                                    </div>
                                }
                                {/* {(this.statusReview == "Awaiting Mentor" || this.statusReview == "Acknowledged") &&
                                    <div className='disib mt15 mb10'>
                                        <button className='btn btn-primary' onClick={() => this.saveData(0)}>Save Draft</button>
                                        <button className='btn btn-secondary ml1' onClick={() => this.saveData(3)}>Submit To Mentor For Approval</button>
                                    </div>
                                } */}

                                <button className='btn btn-outline-dark ml1 disib mr15' onClick={() => this.cancel()}>Close</button>
                            </div>

                        }



                    </div>
                    {/* <textarea
                        placeholder=""
                        value={this.state["singOff"]}
                        onChange={this.onEventChange}
                        rows={4}
                        name="RDTAComments"
                        disabled={this.isDisabed}
                    ></textarea> */}
                    <div className='sectionContainer'>

                        <div className='subContainer'>
                            <h5>Sign Off History</h5>
                            {
                                this.createSignOffHistory()}
                        </div>
                    </div>

                </div>
                <Dialog
                    hidden={this.state["showModel"]}
                    onDismiss={() => { this.setState({ showModel: true }); }}
                    dialogContentProps={dialogContentProps}
                // modalProps={modalProps}
                >
                    <DialogFooter>
                        <button className='btn btn-primary'
                            onClick={() => this.showAssigneeForm()}>OK</button>
                    </DialogFooter>
                </Dialog>
            </div >
        );
    }
    public createSignOffHistory = (): JSX.Element => {
        var rows = [];
        if (this.state["signOffHistory"]) {
            let sortedVersions = this.state["signOffHistory"]["results"].sort(this.compare);
            console.log("sortedVersions", sortedVersions);
            sortedVersions.forEach(element => {
                rows.push(<span className='disb'>  {element.Signoff_x005f_x0020_x005f_History}  </span>);
            });
        }
        //this.setState({singOff:rows});

        return (<div className='signoffhistory'>{rows}</div>);

    }
    public cancel = () => {
        window.location.href = this.webUrl + "/Lists/" + Config.ListNames.NonEngReviewredirectUrl;
    }
    public compare = (a, b) => {
        if (a.owshiddenversion < b.owshiddenversion) {
            return -1;
        }
        if (a.owshiddenversion > b.owshiddenversion) {
            return 1;
        }
        return 0;
    }
    private saveDataJsom = async (type: any) => {
        const context: SP.ClientContext = new SP.ClientContext("https://smarttechies.sharepoint.com/sites/tagperfmgmt");
        var oList = context.get_web().get_lists().getByTitle('Non Engagement Review Template');

        let oListItem = oList.getItemById(this.state["ItemID"]);
        const columns = Config.NonEngagementReviewTemplateColumns;
        oListItem.set_item(columns.RDTAQ1, this.state["Fields"]["RDTAQ1"]);
        oListItem.set_item(columns.RDTAQ2, this.state["Fields"]["RDTAQ2"]);
        oListItem.set_item(columns.RDTAQ3, this.state["Fields"]["RDTAQ3"]);
        oListItem.set_item(columns.RDTAComments, this.state["Fields"]["RDTAComments"]);
        oListItem.set_item(columns.SummaryOfStrengths, this.state["Fields"]["SummaryOfStrengths"]);
        oListItem.set_item(columns.SummaryOfProgress, this.state["Fields"]["SummaryOfProgress"]);
        oListItem.set_item(columns.SummaryOfImprovement, this.state["Fields"]["SummaryOfImprovement"]);
        oListItem.set_item(columns.OtherConsiderations, this.state["Fields"]["OtherConsiderations"]);
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
            let formattedDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + ':' + d.getMinutes() + ' ' + (d.getHours() >= 12 ? "PM" : "AM");
            let historyComment = "Reviewee Submitted - " + this.state["nonEngReviewData"].RevieweeName.Title + " , " + formattedDate;
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
        context.executeQueryAsync((sender: any, args: SP.ClientRequestSucceededEventArgs): void => {
            //console.log("showModel", res);
            this.setState({ showModel: false });
        }, (sender: any, args: SP.ClientRequestFailedEventArgs): void => {
            this.setState({
                loadingLists: false,
                listTitles: [],
                error: args.get_message()
            });
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });
    }
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
        return (((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()) + ' ' + hrs + ":" + MM + ' ' + pp);

    }
    private saveData = async (type: any) => {
        console.log("Calling save", this.state["Fields"]);
        // let d1 = Date.now();
        // let d = new Date(d1);
        // let formattedDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + ':' + d.getMinutes() + ' ' + (d.getHours() >= 12 ? "PM" : "AM");
        let formattedDate = this.dateFormat(new Date());
        let data = {};
        const columns = Config.NonEngagementReviewTemplateColumns;

        data[columns.FYYTDUtilization] = this.state["Fields"]["FYYTDUtilization"];


        data[columns.RDQ1] = this.state["Fields"]["Relationship development1"];
        data[columns.RDQ2] = this.state["Fields"]["Relationship development2"];
        data[columns.RDQ3] = this.state["Fields"]["Relationship development3"];
        data[columns.RDQ4] = this.state["Fields"]["Relationship development4"];
        data[columns.RDQ5] = this.state["Fields"]["Relationship development5"];
        data[columns.RDComments] = this.state["Fields"]["Relationship developmentComments"];

        data[columns.BQ1] = this.state["Fields"]["Business development1"];
        data[columns.BQ2] = this.state["Fields"]["Business development2"];
        data[columns.BQ3] = this.state["Fields"]["Business development3"];
        data[columns.BQ4] = this.state["Fields"]["Business development4"];
        data[columns.BDComments] = this.state["Fields"]["Business developmentComments"];

        data[columns.PD1] = this.state["Fields"]["Practice development1"];
        data[columns.PD2] = this.state["Fields"]["Practice development2"];
        data[columns.PD3] = this.state["Fields"]["Practice development3"];
        data[columns.PD4] = this.state["Fields"]["Practice development4"];
        data[columns.PDComments] = this.state["Fields"]["Practice developmentComments"];




        data[columns.RDTAQ1] = this.state["Fields"]["Developing RDTA characteristics1"];
        data[columns.RDTAQ2] = this.state["Fields"]["Developing RDTA characteristics2"];
        data[columns.RDTAQ3] = this.state["Fields"]["Developing RDTA characteristics3"];
        data[columns.RDTAComments] = this.state["Fields"]["Developing RDTA characteristicsComments"];

        data[columns.SummaryOfStrengths] = this.state["Fields"]["SummaryOfStrengths"];
        data[columns.SummaryOfProgress] = this.state["Fields"]["SummaryOfProgress"];
        data[columns.SummaryOfImprovement] = this.state["Fields"]["SummaryOfImprovement"];
        data[columns.OtherConsiderations] = this.state["Fields"]["OtherConsiderations"];
        data[columns.Submitted] = type;
        data[columns.ORC] = this.state["Fields"]["ORC"];
        data[columns.RAC] = this.state["Fields"]["RAC"];
        if (type == 3) {

            data[columns.SignoffHistory] = "Reviewee Submitted - " + this.state["nonEngReviewData"].RevieweeName.Title + " , " + formattedDate;
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
            let comments = this.state["Fields"]["ORC"] ? " | Comments: " + this.state["Fields"]["ORC"] : "";
            data[columns.SignoffHistory] = "Review Reverted - " + this.state["nonEngReviewData"].Mentor.Title + " , " + formattedDate + comments;
        }
        if (type == 6) {
            data[columns.Submitted] = type;

            data[columns.StatusReview] = "Acknowledged";
            let comments = this.state["Fields"]["RAC"] ? " | Comments: " + this.state["Fields"]["RAC"] : "";
            data[columns.SignoffHistory] = "Acknowledged - " + this.state["nonEngReviewData"].RevieweeName.Title + " , " + formattedDate + comments;
        }
        if (type == 4) {
            data[columns.Submitted] = type;
            data[columns.StatusReview] = "Awaiting Acknowledgement";
            data[columns.SignoffHistory] = "Mentor Approved - " + this.state["nonEngReviewData"].Mentor.Title + " , " + formattedDate;
        }
        console.log(data);
        this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.NonEngReview);

        this.listItemService.updateItem(this.state["ItemID"], data).then((res) => {
            //alert(res);
            console.log("showModel", res);
            this.setState({ newItemResponse: res.data });
            this.showAssigneeForm();
        });

    }
    private showAssigneeForm = () => {
        //this.setState({ showModel: true });
        //window.location.href = this.redirectURL;
        let returnURL = this.props.AppContext.pageContext.web.absoluteUrl + Config.Links.HomePageLink;
        window.location.href = returnURL;

    }
   
}
