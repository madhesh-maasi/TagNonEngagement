import { ContextService } from "../../services/ContextService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from 'moment';
import { User } from "../models/types/User";
import { Enums } from "../../globals/Enums";
import { Config } from "../../globals/Config";
import { TAG_GenericDetails } from "../models/TAG_GenericDetails";
import { TAG_EmployeeDetails } from "../models/TAG_EmployeeDetails";
import { TAG_NonEngReviewSummary } from "../models/TAG_NonEngReviewSummary";
import { TAG_Projects } from "../models/TAG_Projects";
import { TAG_ANMExperienceDetails } from "../models/TAG_ANMExperienceDetails";
import { TAG_PreANMExperienceDetails } from "../models/TAG_PreANMExperienceDetails";
import { TAG_SectionANMExperience } from "../models/TAG_SectionANMExperience";
import { TAG_SectionPreANMExperience } from "../models/TAG_SectionPreANMExperience";
import { TAG_SpecialReviews } from "../models/TAG_SpecialReviews";
import { TAG_SplitReviews } from "../models/TAG_SplitReviews";
import { TAG_SplitAdmin } from "../models/TAG_SplitAdmin";
import { TAG_CombineAdmin } from "../models/TAG_CombineAdmin";
import { TAG_CombineReviews } from "../models/TAG_CombineReviews";

export default class MapCAMLResult extends ContextService {

    constructor(AppContext: WebPartContext, Lcid: number) {
        super(AppContext);
    }

    // Mapping results based on provided type
    public static map(items: any, type: Enums.ItemResultType): any[] {
        let allResults: any[] = [];
        items.forEach(item => {
            let result: any;
            switch (type) {
                case Enums.ItemResultType.TAG_EmployeeDetails: result = this.mapEmployeeDetails(item);
                    break;
                case Enums.ItemResultType.TAG_ItemID: result = this.mapTagItemID(item);
                    break;
                case Enums.ItemResultType.TAG_MentorDetails: result = this.mapMentorDetails(item);
                    break;
                case Enums.ItemResultType.TAG_Roles: result = this.mapGenericDetails(item);
                    break;
                case Enums.ItemResultType.TAG_FiscalYear: result = this.mapGenericDetails(item);
                    break;
                case Enums.ItemResultType.TAG_NonEngReviewSummary: result = this.mapNonEngReviewSummary(item);
                    break;
                case Enums.ItemResultType.TAG_Projects: result = this.mapProjectDetails(item);
                    break;
                    case Enums.ItemResultType.TAG_SpecialReview: result = this.mapSpecialReviews(item);
                    break;
                    case Enums.ItemResultType.TAG_CombinedReview: result = this.mapCombineReviews(item);
                    break;
                    case Enums.ItemResultType.TAG_CombineAdmin: result = this.mapCombineAdmin(item);
                    break;
                case Enums.ItemResultType.TAG_SplitReview: result = this.mapSplitReviews(item);
                    break;
                    case Enums.ItemResultType.TAG_SplitAdmin: result = this.mapSplitAdmin(item);
                    break;
            }
            allResults.push(result);
        });
        return allResults;
    }

    private static mapCombineReviews(item: any) {

        
        let result = new TAG_CombineReviews();
        result.Title = item[Config.BaseColumns.Title];
        result.ID = item.ID;
        result.ReviewIDs = item[Config.CombineReviewsListColumns.ReviewIDs];
        result.JobTitle = item[Config.CombineReviewsListColumns.JobTitle];
        result.ProjectManager = this.mapUser(item[Config.CombineReviewsListColumns.ProjectManager]);
        result.ProjectStartDate =item[Config.CombineReviewsListColumns.ProjectEndDate]== "" ? new Date() : new Date(item[Config.CombineReviewsListColumns.ProjectStartDate]);
        result.ProjectEndDate = item[Config.CombineReviewsListColumns.ProjectEndDate]=="" ? new Date() : new Date(item[Config.CombineReviewsListColumns.ProjectEndDate]);
         result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled] == "" ? new Date() : new Date(item[Config.CombineReviewsListColumns.LastHoursBilled]);
       // result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled];
        result.NewReviewID = item[Config.CombineReviewsListColumns.NewReviewID];
        result.ServiceLine= item[Config.CombineReviewsListColumns.ServiceLine];
        result.ClientName=item[Config.CombineReviewsListColumns.ClientName]
        return result;
    }

    private static mapSpecialReviews(item: any) {
        let result = new TAG_SpecialReviews();
        result.Title = item[Config.BaseColumns.Title];
        result.ID = item.ID;
        result.LeadMDName = this.mapUser(item[Config.SpecialReviewsListColumns.LeadMDName]);
        result.RevieweeName = this.mapUser(item[Config.SpecialReviewsListColumns.RevieweeName]);
        result.ReviewerName = this.mapUser(item[Config.SpecialReviewsListColumns.ReviewerName]);

        result.LeadMDNameEmail = this.mapUser(item[Config.SpecialReviewsListColumns.LeadMDName]).Email;
        result.RevieweeNameEmail = this.mapUser(item[Config.SpecialReviewsListColumns.RevieweeName]).Email;
        result.ReviewerNameEmail = this.mapUser(item[Config.SpecialReviewsListColumns.ReviewerName]).Email;

        result.EmployeeNumber = item[Config.SpecialReviewsListColumns.EmployeeNumber];
        result.HoursWorked = item[Config.SpecialReviewsListColumns.HoursWorked];
        result.JobTitle = item[Config.SpecialReviewsListColumns.JobTitle];
        result.LastHoursBilled = item[Config.SpecialReviewsListColumns.LastHoursBilled] == "" ? new Date() : new Date(item[Config.SpecialReviewsListColumns.LastHoursBilled]);

        //result.LastHoursBilled = item[Config.SpecialReviewsListColumns.LastHoursBilled];
        result.ServiceLine= item[Config.CombineAdminListColumns.ServiceLine];
        result.ClientName=item[Config.CombineAdminListColumns.ClientName]
        result.NewReviewID = item[Config.SpecialReviewsListColumns.NewReviewID];
        result.ProjectCode = item[Config.SpecialReviewsListColumns.ProjectCode];
        result.ProjectStartDate =item[Config.SpecialReviewsListColumns.ProjectEndDate]== "" ? new Date() : new Date(item[Config.SpecialReviewsListColumns.ProjectStartDate]);
        result.ProjectEndDate = item[Config.SpecialReviewsListColumns.ProjectEndDate]=="" ? new Date() : new Date(item[Config.SpecialReviewsListColumns.ProjectEndDate]);
       result.ProjectStatus = item[Config.SpecialReviewsListColumns.ProjectStatus];

        return result;
    }

    private static mapCombineAdmin(item: any) {

        
        let result = new TAG_CombineAdmin();
        result.Title = item[Config.BaseColumns.Title];
        result.ID = item.ID;
        result.ReviewIDs = item[Config.CombineAdminListColumns.ReviewIDs];
        result.JobTitle = item[Config.CombineAdminListColumns.JobTitle];
        result.ProjectManager = this.mapUser(item[Config.CombineAdminListColumns.ProjectManager]);
        result.ReviewerName = this.mapUser(item[Config.CombineAdminListColumns.RevieweeName]);
        result.ReviewerNameEmail = this.mapUser(item[Config.CombineAdminListColumns.RevieweeName]).Email;
        result.ProjectStartDate =item[Config.CombineAdminListColumns.ProjectEndDate]== "" ? new Date() : new Date(item[Config.CombineAdminListColumns.ProjectStartDate]);
        result.ProjectEndDate = item[Config.CombineAdminListColumns.ProjectEndDate]=="" ? new Date() : new Date(item[Config.CombineAdminListColumns.ProjectEndDate]);
        result.LastHoursBilled = item[Config.CombineAdminListColumns.LastHoursBilled] == "" ? new Date() : new Date(item[Config.CombineReviewsListColumns.LastHoursBilled]);
       // result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled];
        result.NewReviewID = item[Config.CombineAdminListColumns.NewReviewID];
        result.ServiceLine= item[Config.CombineAdminListColumns.ServiceLine];
        result.ClientName=item[Config.CombineAdminListColumns.ClientName]
        return result;
    }
    private static mapSplitReviews(item: any) {
        let result = new TAG_SplitReviews();
        result.Title = item[Config.BaseColumns.Title];
        result.ID = item.ID;
        result.SourceReviewID = item[Config.SplitReviewsListColumns.SourceReviewID];
        result.HourstoReview = item[Config.SplitReviewsListColumns.HourstoReview];
        result.SplitReviewID = item[Config.SplitReviewsListColumns.SplitReviewID];
        result.ServiceLine= item[Config.SplitReviewsListColumns.ServiceLine]
        result.JobTitle=item[Config.SplitReviewsListColumns.JobTitle]
        return result;
    }
    private static mapSplitAdmin(item: any) {
       
        let result = new TAG_SplitAdmin();
        result.Title = item[Config.BaseColumns.Title];
        result.ID = item.ID;
        result.SourceReviewID = item[Config.SplitAdminListColumns.SourceReviewID];
        result.HourstoReview = item[Config.SplitAdminListColumns.HourstoReview];
        result.SplitReviewID = item[Config.SplitAdminListColumns.SplitReviewID];
        result.RevieweeName = this.mapUser(item[Config.SplitAdminListColumns.RevieweeName]);
        result.RevieweeNameEmail = this.mapUser(item[Config.SplitAdminListColumns.RevieweeName]).Email;
        result.ServiceLine= item[Config.SplitAdminListColumns.ServiceLine]
        result.JobTitle=item[Config.SplitAdminListColumns.JobTitle]
        return result;
    }

    //#region "Solution Related Mappers"
    private static mapGenericDetails(item: any) {
        let result = new TAG_GenericDetails;

        // Basic top section
        result.Title = item[Config.BaseColumns2.Title];
        //result.SortOrder = item[Config.BaseColumns2.SortOrder];
        return result;
    }

    //#region "Solution Related Mappers"
    private static mapNonEngReviewSummary(item: any) {
        let result = new TAG_NonEngReviewSummary;

        // Basic top section
        // result.Title  = item[Config.NonEngagementReviewTemplateColumns.Title];
        result.Role = item[Config.NonEngagementReviewTemplateColumns.Role];
        result.FiscalYear = item[Config.NonEngagementReviewTemplateColumns.FiscalYear];
        result.RevieweeName = this.mapUser(item[Config.NonEngagementReviewTemplateColumns.RevieweeName]);
        result.Mentor = this.mapUser(item[Config.NonEngagementReviewTemplateColumns.Mentor]);

        result.SignoffHistory = item[Config.NonEngagementReviewTemplateColumns.SignoffHistory];
        result.StatusReview = item[Config.NonEngagementReviewTemplateColumns.StatusReview];
        result.Submitted = item[Config.NonEngagementReviewTemplateColumns.Submitted];


        result.SummaryOfStrengths = item[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths];
        result.SummaryOfProgress = item[Config.NonEngagementReviewTemplateColumns.SummaryOfProgress];
        result.SummaryOfImprovement = item[Config.NonEngagementReviewTemplateColumns.SummaryOfImprovement];
        result.OtherConsiderations = item[Config.NonEngagementReviewTemplateColumns.OtherConsiderations];

        result.RDTAQ1 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ1];
        result.RDTAQ2 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ2];
        result.RDTAQ3 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ3];
        result.RDTAComments = item[Config.NonEngagementReviewTemplateColumns.RDTAComments];
        result.RAC = item[Config.NonEngagementReviewTemplateColumns.RAC];
        result.ORC = item[Config.NonEngagementReviewTemplateColumns.ORC];

        result.FYYTDUtilization = item[Config.NonEngagementReviewTemplateColumns.FYYTDUtilization];
        result.RDComments = item[Config.NonEngagementReviewTemplateColumns.RDComments];
        result.PDComments = item[Config.NonEngagementReviewTemplateColumns.PDComments];
        result.BDComments = item[Config.NonEngagementReviewTemplateColumns.BDComments];

        result._x0052_DQ1 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ1];
        result._x0052_DQ2 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ2];
        result._x0052_DQ3 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ3];
        result._x0052_DQ4 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ4];
        result._x0052_DQ5 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ5];
        


        result._x0042_DQ1 = item[Config.NonEngagementReviewTemplateColumns.GetBQ1];
        result._x0042_DQ2 = item[Config.NonEngagementReviewTemplateColumns.GetBQ2];
        result._x0042_DQ3 = item[Config.NonEngagementReviewTemplateColumns.GetBQ3];
        result._x0042_DQ4 = item[Config.NonEngagementReviewTemplateColumns.GetBQ4];


        result._x0050_DQ1 = item[Config.NonEngagementReviewTemplateColumns.GetPD1];
        result._x0050_DQ2 = item[Config.NonEngagementReviewTemplateColumns.GetPD2];
        result._x0050_DQ3 = item[Config.NonEngagementReviewTemplateColumns.GetPD3];
        result._x0050_DQ4 = item[Config.NonEngagementReviewTemplateColumns.GetPD4];


        return result;
    }
    private static mapProjectDetails(item: any) {
        let result = new TAG_Projects;

        // Basic top sectionID
        result.ID  = item[Config.ProjectListColumns.ID];
        result.ProjectName = item[Config.ProjectListColumns.ProjectName];
        result.ProjectCode = item[Config.ProjectListColumns.ProjectCode];
        
        result.RevieweeName = this.mapUser(item[Config.ProjectListColumns.RevieweeName]);
        result.ReviewerName = this.mapUser(item[Config.ProjectListColumns.ReviewerName]);
        result.LeadMDName = this.mapUser(item[Config.ProjectListColumns.LeadMDName]);
        result.HoursWorked = item[Config.ProjectListColumns.HoursWorked];
        result.ProjectStartDate = this.mapDate(item[item[Config.ProjectListColumns.ProjectStartDate]]);
        result.ProjectEndDate = this.mapDate(item[item[Config.ProjectListColumns.ProjectEndDate]]);
        result.LastHoursBilled = this.mapDate(item[item[Config.ProjectListColumns.LastHoursBilled]]);
        result.ProjectStatus = item[Config.ProjectListColumns.ProjectStatus];
        result.ClientName = item[Config.ProjectListColumns.ClientName];

       

        //result.SortOrder = item[Config.BaseColumns2.SortOrder];
        return result;
    }
    private static mapEmployeeDetails(item: any) {
        let result = new TAG_EmployeeDetails();


        result.Title = item[Config.BaseColumns.Title];

        // Basic top section
        result.Certifications = item[Config.EmployeeSummaryListColumns.Certifications];
        result.Employee = this.mapUser(item[Config.EmployeeSummaryListColumns.Name]);
        result.EmployeeJobTitle = item[Config.EmployeeSummaryListColumns["Job Title"]];
        result.HireDate = this.mapDate(item[Config.EmployeeSummaryListColumns["Hire Date"]]);
        result.Office = item[Config.EmployeeSummaryListColumns.Office];

        // ANM Experience Details
        let experienceDetails: TAG_ANMExperienceDetails[] = [];
        let unformattedExperienceDetails = item[Config.EmployeeSummaryListColumns.ANMExperience];
        if (unformattedExperienceDetails == null || unformattedExperienceDetails == "") {
            experienceDetails = [];
        }
        else {
            experienceDetails = JSON.parse(unformattedExperienceDetails);
        }
        let ANMExperienceResult: TAG_SectionANMExperience = {
            ANMExperience: experienceDetails
        };
        result.SectionANMExperience = ANMExperienceResult;

        // Pre-ANM Experience Details
        let preANMExperienceDetails: TAG_PreANMExperienceDetails[] = [];
        let unformattedPreANMExperienceDetails = item[Config.EmployeeSummaryListColumns["Pre-A&M Experience"]];
        if (unformattedPreANMExperienceDetails == null || unformattedPreANMExperienceDetails == "") {
            preANMExperienceDetails = [];
        }
        else {
            preANMExperienceDetails = JSON.parse(unformattedPreANMExperienceDetails);
        }
        let PreANMExperienceResult: TAG_SectionPreANMExperience = {
            PreANMExperience: preANMExperienceDetails
        };
        result.SectionPreANMExperience = PreANMExperienceResult;

        return result;
    }

    private static mapTagItemID(item: any): Number {
        return item["ID"];
    }

    private static mapMentorDetails(item: any) {
        let result = this.mapUser(item[Config.MentorListColumns.Mentor]);
        return result;
    }



    ////#endregion

    //#region "Common Mappers"

    // Mapping multiple user
    private static mapUsers(userEntries: any): User[] {
        let result: User[] = [];
        if (userEntries instanceof Array) {
            userEntries.forEach(user => {
                result.push(this.mapUser(user));
            });
        }
        else {
            result.push(this.mapUser(userEntries));
        }

        return result;
    }

    // Mapping single user
    private static mapUser(user: any): User {
        // This in required, as in CAML it returns array even if it is single user
        if (user instanceof Array && user.length > 0) {
            user = user[0];
        }
        // Case : when it is null
        if (!user) {
            return new User();
        }
        let result: User = new User();
        result.Email = user["email"];
        result.Id = user["id"];
        result.LoginName = user["sip"];

        if (result.LoginName.indexOf("i:0#") < 0) {
            result.LoginName = "i:0#.f|membership|" + result.Email;
        }

        result.Title = user["title"];
        return result;
    }

    // Mapping boolean value
    private static mapBoolean(itemValue: any): boolean {
        if (itemValue) {
            let result: boolean;
            result = (itemValue == "Yes" || itemValue.value == "1") ? true : false;
            return result;
        }
        return undefined;
    }

    // Mapping date field
    private static mapDate(dateField: any): Date {
        if (dateField) {
            return (new Date(dateField));
        }
        return undefined;
    }

    // Mapping date field and return formatted date string
    private static mapDateWithFormat(dateField: any): string {
        if (dateField) {
            return (moment(dateField).format('D MMMM YYYY'));
        }
        return "";
    }

    //#endregion
}



