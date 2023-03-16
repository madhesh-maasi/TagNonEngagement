import { ContextService } from "../../services/ContextService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from "moment";
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
    items.forEach((item) => {
      let result: any;
      switch (type) {
        case Enums.ItemResultType.TAG_EmployeeDetails:
          result = this.mapEmployeeDetails(item);
          break;
        case Enums.ItemResultType.TAG_ItemID:
          result = this.mapTagItemID(item);
          break;
        case Enums.ItemResultType.TAG_MentorDetails:
          result = this.mapMentorDetails(item);
          break;
        case Enums.ItemResultType.TAG_Roles:
          result = this.mapGenericDetails(item);
          break;
        case Enums.ItemResultType.TAG_FiscalYear:
          result = this.mapGenericDetails(item);
          break;
        case Enums.ItemResultType.TAG_NonEngReviewSummary:
          result = this.mapNonEngReviewSummary(item);
          break;
        case Enums.ItemResultType.TAG_Projects:
          result = this.mapProjectDetails(item);
          break;
        case Enums.ItemResultType.TAG_SpecialReview:
          result = this.mapSpecialReviews(item);
          break;
        case Enums.ItemResultType.TAG_CombinedReview:
          result = this.mapCombineReviews(item);
          break;
        case Enums.ItemResultType.TAG_CombineAdmin:
          result = this.mapCombineAdmin(item);
          break;
        case Enums.ItemResultType.TAG_SplitReview:
          result = this.mapSplitReviews(item);
          break;
        case Enums.ItemResultType.TAG_SplitAdmin:
          result = this.mapSplitAdmin(item);
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
    result.ProjectManager = this.mapUser(
      item[Config.CombineReviewsListColumns.ProjectManager]
    );
    result.ProjectStartDate =
      item[Config.CombineReviewsListColumns.ProjectEndDate] == ""
        ? new Date()
        : new Date(item[Config.CombineReviewsListColumns.ProjectStartDate]);
    result.ProjectEndDate =
      item[Config.CombineReviewsListColumns.ProjectEndDate] == ""
        ? new Date()
        : new Date(item[Config.CombineReviewsListColumns.ProjectEndDate]);
    result.LastHoursBilled =
      item[Config.CombineReviewsListColumns.LastHoursBilled] == ""
        ? new Date()
        : new Date(item[Config.CombineReviewsListColumns.LastHoursBilled]);
    // result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled];
    result.NewReviewID = item[Config.CombineReviewsListColumns.NewReviewID];
    result.ServiceLine = item[Config.CombineReviewsListColumns.ServiceLine];
    result.ClientName = item[Config.CombineReviewsListColumns.ClientName];
    return result;
  }

  private static mapSpecialReviews(item: any) {
    let result = new TAG_SpecialReviews();
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.LeadMDName = this.mapUser(
      item[Config.SpecialReviewsListColumns.LeadMDName]
    );
    result.RevieweeName = this.mapUser(
      item[Config.SpecialReviewsListColumns.RevieweeName]
    );
    result.ReviewerName = this.mapUser(
      item[Config.SpecialReviewsListColumns.ReviewerName]
    );

    result.LeadMDNameEmail = this.mapUser(
      item[Config.SpecialReviewsListColumns.LeadMDName]
    ).Email;
    result.RevieweeNameEmail = this.mapUser(
      item[Config.SpecialReviewsListColumns.RevieweeName]
    ).Email;
    result.ReviewerNameEmail = this.mapUser(
      item[Config.SpecialReviewsListColumns.ReviewerName]
    ).Email;

    result.EmployeeNumber =
      item[Config.SpecialReviewsListColumns.EmployeeNumber];
    result.HoursWorked = item[Config.SpecialReviewsListColumns.HoursWorked];
    result.JobTitle = item[Config.SpecialReviewsListColumns.JobTitle];
    result.LastHoursBilled =
      item[Config.SpecialReviewsListColumns.LastHoursBilled] == ""
        ? new Date()
        : new Date(item[Config.SpecialReviewsListColumns.LastHoursBilled]);

    //result.LastHoursBilled = item[Config.SpecialReviewsListColumns.LastHoursBilled];
    result.ServiceLine = item[Config.CombineAdminListColumns.ServiceLine];
    result.ClientName = item[Config.CombineAdminListColumns.ClientName];
    result.NewReviewID = item[Config.SpecialReviewsListColumns.NewReviewID];
    result.ProjectCode = item[Config.SpecialReviewsListColumns.ProjectCode];
    result.ProjectStartDate =
      item[Config.SpecialReviewsListColumns.ProjectEndDate] == ""
        ? new Date()
        : new Date(item[Config.SpecialReviewsListColumns.ProjectStartDate]);
    result.ProjectEndDate =
      item[Config.SpecialReviewsListColumns.ProjectEndDate] == ""
        ? new Date()
        : new Date(item[Config.SpecialReviewsListColumns.ProjectEndDate]);
    result.ProjectStatus = item[Config.SpecialReviewsListColumns.ProjectStatus];

    return result;
  }

  private static mapCombineAdmin(item: any) {
    let result = new TAG_CombineAdmin();
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.ReviewIDs = item[Config.CombineAdminListColumns.ReviewIDs];
    result.JobTitle = item[Config.CombineAdminListColumns.JobTitle];
    result.ProjectManager = this.mapUser(
      item[Config.CombineAdminListColumns.ProjectManager]
    );
    result.ReviewerName = this.mapUser(
      item[Config.CombineAdminListColumns.RevieweeName]
    );
    result.ReviewerNameEmail = this.mapUser(
      item[Config.CombineAdminListColumns.RevieweeName]
    ).Email;
    result.ProjectStartDate =
      item[Config.CombineAdminListColumns.ProjectEndDate] == ""
        ? new Date()
        : new Date(item[Config.CombineAdminListColumns.ProjectStartDate]);
    result.ProjectEndDate =
      item[Config.CombineAdminListColumns.ProjectEndDate] == ""
        ? new Date()
        : new Date(item[Config.CombineAdminListColumns.ProjectEndDate]);
    result.LastHoursBilled =
      item[Config.CombineAdminListColumns.LastHoursBilled] == ""
        ? new Date()
        : new Date(item[Config.CombineReviewsListColumns.LastHoursBilled]);
    // result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled];
    result.NewReviewID = item[Config.CombineAdminListColumns.NewReviewID];
    result.ServiceLine = item[Config.CombineAdminListColumns.ServiceLine];
    result.ClientName = item[Config.CombineAdminListColumns.ClientName];
    return result;
  }
  private static mapSplitReviews(item: any) {
    let result = new TAG_SplitReviews();
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.SourceReviewID = item[Config.SplitReviewsListColumns.SourceReviewID];
    result.HourstoReview = item[Config.SplitReviewsListColumns.HourstoReview];
    result.SplitReviewID = item[Config.SplitReviewsListColumns.SplitReviewID];
    result.ServiceLine = item[Config.SplitReviewsListColumns.ServiceLine];
    result.JobTitle = item[Config.SplitReviewsListColumns.JobTitle];
    return result;
  }
  private static mapSplitAdmin(item: any) {
    let result = new TAG_SplitAdmin();
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.SourceReviewID = item[Config.SplitAdminListColumns.SourceReviewID];
    result.HourstoReview = item[Config.SplitAdminListColumns.HourstoReview];
    result.SplitReviewID = item[Config.SplitAdminListColumns.SplitReviewID];
    result.RevieweeName = this.mapUser(
      item[Config.SplitAdminListColumns.RevieweeName]
    );
    result.RevieweeNameEmail = this.mapUser(
      item[Config.SplitAdminListColumns.RevieweeName]
    ).Email;
    result.ServiceLine = item[Config.SplitAdminListColumns.ServiceLine];
    result.JobTitle = item[Config.SplitAdminListColumns.JobTitle];
    return result;
  }

  //#region "Solution Related Mappers"
  private static mapGenericDetails(item: any) {
    let result = new TAG_GenericDetails();

    // Basic top section
    result.Title = item[Config.BaseColumns2.Title];
    //result.SortOrder = item[Config.BaseColumns2.SortOrder];
    return result;
  }

  //#region "Solution Related Mappers"
  private static mapNonEngReviewSummary(item: any) {
    let result = new TAG_NonEngReviewSummary();

    // Basic top section
    // result.Title  = item[Config.NonEngagementReviewTemplateColumns.Title];
    result.Role = item[Config.NonEngagementReviewTemplateColumns.Role];
    result.FiscalYear =
      item[Config.NonEngagementReviewTemplateColumns.FiscalYear];
    result.RevieweeName = this.mapUser(
      item[Config.NonEngagementReviewTemplateColumns.RevieweeName]
    );
    result.Mentor = this.mapUser(
      item[Config.NonEngagementReviewTemplateColumns.Mentor]
    );

    result.SignoffHistory =
      item[Config.NonEngagementReviewTemplateColumns.SignoffHistory];
    result.StatusReview =
      item[Config.NonEngagementReviewTemplateColumns.StatusReview];
    result.Submitted =
      item[Config.NonEngagementReviewTemplateColumns.Submitted];

    result.SummaryOfStrengths =
      item[Config.NonEngagementReviewTemplateColumns.SummaryOfStrengths];
    result.SummaryOfProgress =
      item[Config.NonEngagementReviewTemplateColumns.SummaryOfProgress];
    result.SummaryOfImprovement =
      item[Config.NonEngagementReviewTemplateColumns.SummaryOfImprovement];
    result.OtherConsiderations =
      item[Config.NonEngagementReviewTemplateColumns.OtherConsiderations];

    result.RDTAQ1 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ1];
    result.RDTAQ2 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ2];
    result.RDTAQ3 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ3];
    result.RDTAComments =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments];
    result.RAC = item[Config.NonEngagementReviewTemplateColumns.RAC];
    result.ORC = item[Config.NonEngagementReviewTemplateColumns.ORC];

    result.FYYTDUtilization =
      item[Config.NonEngagementReviewTemplateColumns.FYYTDUtilization];
    result.RDComments =
      item[Config.NonEngagementReviewTemplateColumns.RDComments];
    result.PDComments =
      item[Config.NonEngagementReviewTemplateColumns.PDComments];
    result.BDComments =
      item[Config.NonEngagementReviewTemplateColumns.BDComments];

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

    /* Deva Changes Start */
    result._x0042_DQ5 = item[Config.NonEngagementReviewTemplateColumns.GetBQ5];
    result._x0042_DQ6 = item[Config.NonEngagementReviewTemplateColumns.GetBQ6];
    result._x0042_DQ7 = item[Config.NonEngagementReviewTemplateColumns.GetBQ7];
    result._x0042_DQ8 = item[Config.NonEngagementReviewTemplateColumns.GetBQ8];
    result._x0042_DQ9 = item[Config.NonEngagementReviewTemplateColumns.GetBQ9];
    result._x0042_DQ10 =
      item[Config.NonEngagementReviewTemplateColumns.GetBQ10];

    result._x0052_DQ6 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ6];
    result._x0052_DQ7 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ7];
    result._x0052_DQ8 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ8];
    result._x0052_DQ9 = item[Config.NonEngagementReviewTemplateColumns.GetRDQ9];
    result._x0052_DQ10 =
      item[Config.NonEngagementReviewTemplateColumns.GetRDQ10];

    result._x0050_DQ5 = item[Config.NonEngagementReviewTemplateColumns.GetPD5];
    result._x0050_DQ6 = item[Config.NonEngagementReviewTemplateColumns.GetPD6];
    result._x0050_DQ7 = item[Config.NonEngagementReviewTemplateColumns.GetPD7];
    result._x0050_DQ8 = item[Config.NonEngagementReviewTemplateColumns.GetPD8];
    result._x0050_DQ9 = item[Config.NonEngagementReviewTemplateColumns.GetPD9];
    result._x0050_DQ10 =
      item[Config.NonEngagementReviewTemplateColumns.GetPD10];

    result.RDTAQ4 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ4];
    result.RDTAQ5 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ5];
    result.RDTAQ6 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ6];
    result.RDTAQ7 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ7];
    result.RDTAQ8 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ8];
    result.RDTAQ9 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ9];
    result.RDTAQ10 = item[Config.NonEngagementReviewTemplateColumns.RDTAQ10];

    result._x004c_CQ1 = item[Config.NonEngagementReviewTemplateColumns.GetLQ1];
    result._x004c_CQ2 = item[Config.NonEngagementReviewTemplateColumns.GetLQ2];
    result._x004c_CQ3 = item[Config.NonEngagementReviewTemplateColumns.GetLQ3];
    result._x004c_CQ4 = item[Config.NonEngagementReviewTemplateColumns.GetLQ4];
    result._x004c_CQ5 = item[Config.NonEngagementReviewTemplateColumns.GetLQ5];
    result._x004c_CQ6 = item[Config.NonEngagementReviewTemplateColumns.GetLQ6];
    result._x004c_CQ7 = item[Config.NonEngagementReviewTemplateColumns.GetLQ7];
    result._x004c_CQ8 = item[Config.NonEngagementReviewTemplateColumns.GetLQ8];
    result._x004c_CQ9 = item[Config.NonEngagementReviewTemplateColumns.GetLQ9];
    result._x004c_CQ10 =
      item[Config.NonEngagementReviewTemplateColumns.GetLQ10];

    result._x0050_OQ1 = item[Config.NonEngagementReviewTemplateColumns.GetPQ1];
    result._x0050_OQ2 = item[Config.NonEngagementReviewTemplateColumns.GetPQ2];
    result._x0050_OQ3 = item[Config.NonEngagementReviewTemplateColumns.GetPQ3];
    result._x0050_OQ4 = item[Config.NonEngagementReviewTemplateColumns.GetPQ4];
    result._x0050_OQ5 = item[Config.NonEngagementReviewTemplateColumns.GetPQ5];
    result._x0050_OQ6 = item[Config.NonEngagementReviewTemplateColumns.GetPQ6];
    result._x0050_OQ7 = item[Config.NonEngagementReviewTemplateColumns.GetPQ7];
    result._x0050_OQ8 = item[Config.NonEngagementReviewTemplateColumns.GetPQ8];
    result._x0050_OQ9 = item[Config.NonEngagementReviewTemplateColumns.GetPQ9];
    result._x0050_OQ10 =
      item[Config.NonEngagementReviewTemplateColumns.GetPQ10];

    result.RDCQ1 = item[Config.NonEngagementReviewTemplateColumns.RDCQ1];
    result.RDCQ2 = item[Config.NonEngagementReviewTemplateColumns.RDCQ2];
    result.RDCQ3 = item[Config.NonEngagementReviewTemplateColumns.RDCQ3];
    result.RDCQ4 = item[Config.NonEngagementReviewTemplateColumns.RDCQ4];
    result.RDCQ5 = item[Config.NonEngagementReviewTemplateColumns.RDCQ5];
    result.RDCQ6 = item[Config.NonEngagementReviewTemplateColumns.RDCQ6];
    result.RDCQ7 = item[Config.NonEngagementReviewTemplateColumns.RDCQ7];
    result.RDCQ8 = item[Config.NonEngagementReviewTemplateColumns.RDCQ8];
    result.RDCQ9 = item[Config.NonEngagementReviewTemplateColumns.RDCQ9];
    result.RDCQ10 = item[Config.NonEngagementReviewTemplateColumns.RDCQ10];

    result.BDComments1 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments1];
    result.BDComments2 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments2];
    result.BDComments3 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments3];
    result.BDComments4 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments4];
    result.BDComments5 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments5];
    result.BDComments6 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments6];
    result.BDComments7 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments7];
    result.BDComments8 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments8];
    result.BDComments9 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments9];
    result.BDComments10 =
      item[Config.NonEngagementReviewTemplateColumns.BDComments10];

    result.RDComments1 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments1];
    result.RDComments2 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments2];
    result.RDComments3 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments3];
    result.RDComments4 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments4];
    result.RDComments5 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments5];
    result.RDComments6 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments6];
    result.RDComments7 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments7];
    result.RDComments8 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments8];
    result.RDComments9 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments9];
    result.RDComments10 =
      item[Config.NonEngagementReviewTemplateColumns.RDComments10];

    result.PDComments1 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments1];
    result.PDComments2 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments2];
    result.PDComments3 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments3];
    result.PDComments4 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments4];
    result.PDComments5 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments5];
    result.PDComments6 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments6];
    result.PDComments7 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments7];
    result.PDComments8 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments8];
    result.PDComments9 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments9];
    result.PDComments10 =
      item[Config.NonEngagementReviewTemplateColumns.PDComments10];

    result.RDTAComments1 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments1];
    result.RDTAComments2 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments2];
    result.RDTAComments3 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments3];
    result.RDTAComments4 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments4];
    result.RDTAComments5 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments5];
    result.RDTAComments6 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments6];
    result.RDTAComments7 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments7];
    result.RDTAComments8 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments8];
    result.RDTAComments9 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments9];
    result.RDTAComments10 =
      item[Config.NonEngagementReviewTemplateColumns.RDTAComments10];

    result.LCComments =
      item[Config.NonEngagementReviewTemplateColumns.LCComments];
    result.LCComments1 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments1];
    result.LCComments2 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments2];
    result.LCComments3 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments3];
    result.LCComments4 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments4];
    result.LCComments5 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments5];
    result.LCComments6 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments6];
    result.LCComments7 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments7];
    result.LCComments8 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments8];
    result.LCComments9 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments9];
    result.LCComments10 =
      item[Config.NonEngagementReviewTemplateColumns.LCComments10];

    result.POComments =
      item[Config.NonEngagementReviewTemplateColumns.POComments];
    result.POComments1 =
      item[Config.NonEngagementReviewTemplateColumns.POComments1];
    result.POComments2 =
      item[Config.NonEngagementReviewTemplateColumns.POComments2];
    result.POComments3 =
      item[Config.NonEngagementReviewTemplateColumns.POComments3];
    result.POComments4 =
      item[Config.NonEngagementReviewTemplateColumns.POComments4];
    result.POComments5 =
      item[Config.NonEngagementReviewTemplateColumns.POComments5];
    result.POComments6 =
      item[Config.NonEngagementReviewTemplateColumns.POComments6];
    result.POComments7 =
      item[Config.NonEngagementReviewTemplateColumns.POComments7];
    result.POComments8 =
      item[Config.NonEngagementReviewTemplateColumns.POComments8];
    result.POComments9 =
      item[Config.NonEngagementReviewTemplateColumns.POComments9];
    result.POComments10 =
      item[Config.NonEngagementReviewTemplateColumns.POComments10];

    result.RDCComments =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments];
    result.RDCComments1 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments1];
    result.RDCComments2 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments2];
    result.RDCComments3 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments3];
    result.RDCComments4 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments4];
    result.RDCComments5 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments5];
    result.RDCComments6 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments6];
    result.RDCComments7 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments7];
    result.RDCComments8 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments8];
    result.RDCComments9 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments9];
    result.RDCComments10 =
      item[Config.NonEngagementReviewTemplateColumns.RDCComments10];
    /* Deva Changes End */

    return result;
  }
  private static mapProjectDetails(item: any) {
    let result = new TAG_Projects();

    // Basic top sectionID
    result.ID = item[Config.ProjectListColumns.ID];
    result.ProjectName = item[Config.ProjectListColumns.ProjectName];
    result.ProjectCode = item[Config.ProjectListColumns.ProjectCode];

    result.RevieweeName = this.mapUser(
      item[Config.ProjectListColumns.RevieweeName]
    );
    result.ReviewerName = this.mapUser(
      item[Config.ProjectListColumns.ReviewerName]
    );
    result.LeadMDName = this.mapUser(
      item[Config.ProjectListColumns.LeadMDName]
    );
    result.HoursWorked = item[Config.ProjectListColumns.HoursWorked];
    result.ProjectStartDate = this.mapDate(
      item[item[Config.ProjectListColumns.ProjectStartDate]]
    );
    result.ProjectEndDate = this.mapDate(
      item[item[Config.ProjectListColumns.ProjectEndDate]]
    );
    result.LastHoursBilled = this.mapDate(
      item[item[Config.ProjectListColumns.LastHoursBilled]]
    );
    result.ProjectStatus = item[Config.ProjectListColumns.ProjectStatus];
    result.ClientName = item[Config.ProjectListColumns.ClientName];

    //result.SortOrder = item[Config.BaseColumns2.SortOrder];
    return result;
  }
  private static mapEmployeeDetails(item: any) {
    let result = new TAG_EmployeeDetails();

    result.Title = item[Config.BaseColumns.Title];

    // Basic top section
    result.Certifications =
      item[Config.EmployeeSummaryListColumns.Certifications];
    result.Employee = this.mapUser(
      item[Config.EmployeeSummaryListColumns.Name]
    );
    result.EmployeeJobTitle =
      item[Config.EmployeeSummaryListColumns["Job Title"]];
    result.HireDate = this.mapDate(
      item[Config.EmployeeSummaryListColumns["Hire Date"]]
    );
    result.Office = item[Config.EmployeeSummaryListColumns.Office];

    // ANM Experience Details
    let experienceDetails: TAG_ANMExperienceDetails[] = [];
    let unformattedExperienceDetails =
      item[Config.EmployeeSummaryListColumns.ANMExperience];
    if (
      unformattedExperienceDetails == null ||
      unformattedExperienceDetails == ""
    ) {
      experienceDetails = [];
    } else {
      experienceDetails = JSON.parse(unformattedExperienceDetails);
    }
    let ANMExperienceResult: TAG_SectionANMExperience = {
      ANMExperience: experienceDetails,
    };
    result.SectionANMExperience = ANMExperienceResult;

    // Pre-ANM Experience Details
    let preANMExperienceDetails: TAG_PreANMExperienceDetails[] = [];
    let unformattedPreANMExperienceDetails =
      item[Config.EmployeeSummaryListColumns["Pre-A&M Experience"]];
    if (
      unformattedPreANMExperienceDetails == null ||
      unformattedPreANMExperienceDetails == ""
    ) {
      preANMExperienceDetails = [];
    } else {
      preANMExperienceDetails = JSON.parse(unformattedPreANMExperienceDetails);
    }
    let PreANMExperienceResult: TAG_SectionPreANMExperience = {
      PreANMExperience: preANMExperienceDetails,
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
      userEntries.forEach((user) => {
        result.push(this.mapUser(user));
      });
    } else {
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
      result = itemValue == "Yes" || itemValue.value == "1" ? true : false;
      return result;
    }
    return undefined;
  }

  // Mapping date field
  private static mapDate(dateField: any): Date {
    if (dateField) {
      return new Date(dateField);
    }
    return undefined;
  }

  // Mapping date field and return formatted date string
  private static mapDateWithFormat(dateField: any): string {
    if (dateField) {
      return moment(dateField).format("D MMMM YYYY");
    }
    return "";
  }

  //#endregion
}
