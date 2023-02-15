import * as React from 'react';
import styles from '../AnmNonEngagement.module.scss';
import ListItemService from "../../../../services/ListItemService";
import UserService from "../../../../services/UserService";
import { Config } from "../../../../globals/Config";
import { Enums } from "../../../../globals/Enums";
import 'react-dropdown/style.css';
import { TAG_NonEngReviewSummary } from '../../../../domain/models/TAG_NonEngReviewSummary';
import { TAG_Projects } from '../../../../domain/models/TAG_Projects';

export default class RevieweeForm extends React.Component<any, {}> {
    private listItemService: ListItemService;
    private userService: UserService;
    constructor(props: any) {
        super(props);
        this.state = {

            IsLoading: true,
            AppContext: this.props.AppContext,
            allProjects: []
        };

    }
    public async componentDidMount() {
        // Fetch Loggred user name, Roles and tax year, Mentor
        let itemId = "";
        if (this.props.ItemID == null || this.props.ItemID == undefined) {
            itemId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        }
        else {
            itemId = this.props.ItemID;
        }
        console.log('props Project', this.props);
        if (itemId != "") {
            this.listItemService = new ListItemService(this.props.AppContext, Config.ListNames.NonEngReview);

            const nonEngReviewData: TAG_NonEngReviewSummary = await this.listItemService.getItemUsingCAML(parseInt(itemId),
                [Config.NonEngagementReviewTemplateColumns.FiscalYear,
                Config.NonEngagementReviewTemplateColumns.Role, Config.NonEngagementReviewTemplateColumns.RevieweeName,
                Config.NonEngagementReviewTemplateColumns.Mentor
                ],
                undefined,
                Enums.ItemResultType.TAG_NonEngReviewSummary);
            //console.log("nonEngReviewData", nonEngReviewData);
            if (nonEngReviewData) {
                //const camlFilterConditions = "<Where><And><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE' /><Value Type='Lookup'>" + nonEngReviewData.RevieweeName.Id + "</Value></Eq><Eq><FieldRef Name='Fiscal_x0020_Year' /><Value Type='Text'>" + nonEngReviewData.FiscalYear + "</Value></Eq></And></Where>";
                const camlFilterConditions = "<Where><And><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE' /><Value Type='Lookup'>" + nonEngReviewData.RevieweeName.Id + "</Value></Eq><And><Eq><FieldRef Name='Fiscal_x0020_Year' /><Value Type='Text'>" + nonEngReviewData.FiscalYear + "</Value></Eq><Eq><FieldRef Name='Status_x0020_of_x0020_Review' /><Value Type='Text'>Acknowledged</Value></Eq></And></And></Where>";
                console.log("camlFilterConditions", camlFilterConditions);
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
                    currentuser: this.props.user,
                    allProjects: allProjects == null ? [] : allProjects
                });
            }
        }


    }
    public componentWillReceiveProps(props) {
        const { userId } = this.props;
        if (props.userId !== userId) {
            this.componentDidMount();
        }
    }
    public render(): React.ReactElement<any> {
        return (
            <div className={styles.anmNonEngagement}>
                <div className='mainContainer'>
                    <div className='row mt1'>
                        <div className='col-md-12'>

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th >
                                            <label className={styles.boldlabel} >Project Name</label>
                                        </th>
                                        <th >
                                            <label className={styles.boldlabel} >Hours Charged</label>
                                        </th>

                                        <th>
                                            <label className={styles.boldlabel}>Client Name</label>
                                        </th>
                                        <th>
                                            <label className={styles.boldlabel}>Reviewer Name</label>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        //Case: When there is no data
                                        this.state["allProjects"].length == 0 &&
                                        <tr>
                                            <td colSpan={4}>
                                                There is no item to show in this view of 'Project' list.
                                            </td>
                                        </tr>
                                    }


                                    {this.state["allProjects"].length > 0 &&
                                        <React.Fragment>
                                            {this.state["allProjects"].map((element, index) => {

                                                return <tr>
                                                    <td>
                                                        <label>{element.ProjectName}</label>
                                                    </td>
                                                    <td >
                                                        <label>{element.HoursWorked}</label>
                                                    </td>
                                                    <td >
                                                        <label>{element.ClientName}</label>
                                                    </td>
                                                    <td >
                                                        <label>{element.ReviewerName.Title}</label>
                                                    </td>

                                                </tr>;
                                            })
                                            }
                                        </React.Fragment>
                                    }


                                    {/* EDIT MODE */}

                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
