// This namespace contains solution specific Configuration items
export namespace Config {
  export const Search_RowLimit = 250;
  export const List_ThresholdLimit = 5000;

  // Date Formats
  export const DateFormatMoment = "";

  export const ListNames = {
    EmployeeSummary: "Employee Summary",
    Mentor: "Mentor",
    NonEngReview: "Non Engagement Reviews",
    NonEngReviewredirectUrl: "Non Engagement Review",
    FiscalYears: "FiscalYears",
    Roles: "Roles",
    Projects: "Projects",
    Questionnaire: "Questionnaire",
    CombineReviews: "Combine Reviews",
    SpecialReviews: "Special Reviews",
    SplitReviews: "Split Reviews",
    CombineAdmin: "Combine Admin",
    SplitAdmin: "Split Admin",
  };

  export const ListCAMLFields = {};

  // List sharepoint generated columns with internal name
  export const BaseColumns = {
    Id: "Id",
    Title: "Title",
  };

  // List sharepoint generated columns with internal name
  export const BaseColumns2 = {
    SortOrder: "SortOrder",
    Title: "Title",
  };

  // Key Value pair of Employee Summary list column title and internal names
  export const EmployeeSummaryListColumns = {
    ANMExperience: "A_x0026_M_x0020_Experience",
    Certifications: "Certifications",
    Company: "Company_x002f_Firm",
    "Fiscal Year": "Fiscal_x0020_Year",
    Group: "Group",
    "Hire Date": "Hire_x0020_Date",
    "Job Title": "Job_x0020_Title",
    Level: "Level",
    Mentor: "Mentor",
    "Mentor Id": "MentorId",
    Name: "Name",
    "Name Id": "NameId",
    Office: "Office",
    "Pre-A&M Experience": "Pre_x002d_A_x0026_M_x0020_Experi",
    "Previous  Level": "Previous_x0020__x0020_Level",
    Utilization: "Utilization",
    Years: "Years",
  };

  export const SplitReviewsListColumns = {
    SourceReviewID: "Source_x0020_Review_x0020_ID",
    HourstoReview: "Hours_x0020_to_x0020_Review",
    SplitReviewID: "Split_x0020_Review_x0020_ID",
    ServiceLine: "Service_x0020_Line",
    JobTitle: "Job_x0020_Title",
  };

  export const SplitAdminListColumns = {
    SourceReviewID: "Source_x0020_Review_x0020_ID",
    HourstoReview: "Hours_x0020_to_x0020_Review",
    SplitReviewID: "Split_x0020_Review_x0020_ID",
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    ServiceLine: "Service_x0020_Line",
    JobTitle: "Job_x0020_Title",
    StatusFlag: "StatusFlag",
  };

  export const CombineReviewsListColumns = {
    ReviewIDs: "Review_x0020_IDs",
    ProjectManager: "Project_x0020_Manager",
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    JobTitle: "Job_x0020_Title",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    NewReviewID: "New_x0020_Review_x0020_ID",
    ClientName: "Customer_x0020_Name",
    ServiceLine: "Service_x0020_Line",
  };

  export const SpecialReviewsListColumns = {
    EmployeeNumber: "Employee_x0020_Number",
    HoursWorked: "Hours_x0020_Worked",
    JobTitle: "JobTitle1",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    LeadMDName: "Lead_x0020_MD_x0020_Name",
    LeadMDNameId: "Lead_x0020_MD_x0020_NameId",
    NewReviewID: "New_x0020_Review_x0020_ID",
    ProjectCode: "Project_x0020_Code",
    ProjectStatus: "Project_x0020_Status",
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    ReviewerName: "Reviewer_x0020_Name",
    ReviewerNameId: "Reviewer_x0020_NameId",
    ClientName: "Customer_x0020_Name",
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    ServiceLine: "Service_x0020_Line",
  };

  export const CombineAdminListColumns = {
    ReviewIDs: "Review_x0020_IDs",
    ProjectManager: "Project_x0020_Manager",
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    JobTitle: "JobTitle1",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    NewReviewID: "New_x0020_Review_x0020_ID",
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    ServiceLine: "Service_x0020_Line",
    ClientName: "Customer_x0020_Name",
    StatusFlag: "StatusFlag",
  };

  // Key Value pair of Mentor list column title and internal names
  export const MentorListColumns = {
    RevieweeName: "Reviewee_x0020_Name",
    "RevieweeName Id": "Reviewee_x0020_NameId",
    Mentor: "Mentor_x0020_Name",
    "Mentor Id": "Mentor_x0020_NameId",
  };

  // Key Value pair of Non Eng review Summary list column title and internal names
  export const NonEngagementReviewTemplateColumns = {
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeId: "Reviewee_x0020_NameId",
    FiscalYear: "Fiscal_x0020_Year",
    Role: "Role",
    StatusReview: "Status_x0020_of_x0020_Review",
    Submitted: "Submitted",
    MentorId: "Mentor_x0020_NameId",
    Mentor: "Mentor_x0020_Name",
    RDQ1: "OData__x0052_DQ1",
    RDQ2: "OData__x0052_DQ2",
    RDQ3: "OData__x0052_DQ3",
    RDQ4: "OData__x0052_DQ4",
    RDQ5: "OData__x0052_DQ5",
    GetRDQ1: "_x0052_DQ1",
    GetRDQ2: "_x0052_DQ2",
    GetRDQ3: "_x0052_DQ3",
    GetRDQ4: "_x0052_DQ4",
    GetRDQ5: "_x0052_DQ5",
    RDComments: "RDComments",
    SummaryOfImprovement: "SummaryOfImprovement",
    SummaryOfProgress: "SummaryOfProgress",
    SummaryOfStrengths: "SummaryOfStrengths",
    OtherConsiderations: "OtherConsiderations",
    RDTAComments: "RDTAComments",
    RDTAQ1: "RDTAQ1",
    RDTAQ2: "RDTAQ2",
    RDTAQ3: "RDTAQ3",
    SignoffHistory: "Signoff_x0020_History",
    RAC: "REVIEWEE_x0020_ACKNOWLEDGEMENT_x",
    ORC: "Optional_x0020_Reversion_x0020_C",

    BQ1: "OData__x0042_DQ1",
    BQ2: "OData__x0042_DQ2",
    BQ3: "OData__x0042_DQ3",
    BQ4: "OData__x0042_DQ4",
    BDComments: "BDComments",

    GetBQ1: "_x0042_DQ1",
    GetBQ2: "_x0042_DQ2",
    GetBQ3: "_x0042_DQ3",
    GetBQ4: "_x0042_DQ4",

    PD1: "OData__x0050_DQ1",
    PD2: "OData__x0050_DQ2",
    PD3: "OData__x0050_DQ3",
    PD4: "OData__x0050_DQ4",
    PDComments: "PDComments",

    GetPD1: "_x0050_DQ1",
    GetPD2: "_x0050_DQ2",
    GetPD3: "_x0050_DQ3",
    GetPD4: "_x0050_DQ4",

    FYYTDUtilization: "FYYTDUtilization",
    Title: "Title",

    /* Deva Create Start */
    GetBQ5: "_x0042_DQ5",
    GetBQ6: "_x0042_DQ6",
    GetBQ7: "_x0042_DQ7",
    GetBQ8: "_x0042_DQ8",
    GetBQ9: "_x0042_DQ9",
    GetBQ10: "_x0042_DQ10",

    GetRDQ6: "_x0052_DQ6",
    GetRDQ7: "_x0052_DQ7",
    GetRDQ8: "_x0052_DQ8",
    GetRDQ9: "_x0052_DQ9",
    GetRDQ10: "_x0052_DQ10",

    GetPD5: "_x0050_DQ5",
    GetPD6: "_x0050_DQ6",
    GetPD7: "_x0050_DQ7",
    GetPD8: "_x0050_DQ8",
    GetPD9: "_x0050_DQ9",
    GetPD10: "_x0050_DQ10",

    RDTAQ4: "RDTAQ4",
    RDTAQ5: "RDTAQ5",
    RDTAQ6: "RDTAQ6",
    RDTAQ7: "RDTAQ7",
    RDTAQ8: "RDTAQ8",
    RDTAQ9: "RDTAQ9",
    RDTAQ10: "RDTAQ10",

    GetLQ1: "_x004c_CQ1",
    GetLQ2: "_x004c_CQ2",
    GetLQ3: "_x004c_CQ3",
    GetLQ4: "_x004c_CQ4",
    GetLQ5: "_x004c_CQ5",
    GetLQ6: "_x004c_CQ6",
    GetLQ7: "_x004c_CQ7",
    GetLQ8: "_x004c_CQ8",
    GetLQ9: "_x004c_CQ9",
    GetLQ10: "_x004c_CQ10",

    GetPQ1: "_x0050_OQ1",
    GetPQ2: "_x0050_OQ2",
    GetPQ3: "_x0050_OQ3",
    GetPQ4: "_x0050_OQ4",
    GetPQ5: "_x0050_OQ5",
    GetPQ6: "_x0050_OQ6",
    GetPQ7: "_x0050_OQ7",
    GetPQ8: "_x0050_OQ8",
    GetPQ9: "_x0050_OQ9",
    GetPQ10: "_x0050_OQ10",

    RDCQ1: "RDCQ1",
    RDCQ2: "RDCQ2",
    RDCQ3: "RDCQ3",
    RDCQ4: "RDCQ4",
    RDCQ5: "RDCQ5",
    RDCQ6: "RDCQ6",
    RDCQ7: "RDCQ7",
    RDCQ8: "RDCQ8",
    RDCQ9: "RDCQ9",
    RDCQ10: "RDCQ10",

    BDComments1: "BDComments1",
    BDComments2: "BDComments2",
    BDComments3: "BDComments3",
    BDComments4: "BDComments4",
    BDComments5: "BDComments5",
    BDComments6: "BDComments6",
    BDComments7: "BDComments7",
    BDComments8: "BDComments8",
    BDComments9: "BDComments9",
    BDComments10: "BDComments10",

    RDComments1: "RDComments1",
    RDComments2: "RDComments2",
    RDComments3: "RDComments3",
    RDComments4: "RDComments4",
    RDComments5: "RDComments5",
    RDComments6: "RDComments6",
    RDComments7: "RDComments7",
    RDComments8: "RDComments8",
    RDComments9: "RDComments9",
    RDComments10: "RDComments10",

    PDComments1: "PDComments1",
    PDComments2: "PDComments2",
    PDComments3: "PDComments3",
    PDComments4: "PDComments4",
    PDComments5: "PDComments5",
    PDComments6: "PDComments6",
    PDComments7: "PDComments7",
    PDComments8: "PDComments8",
    PDComments9: "PDComments9",
    PDComments10: "PDComments10",

    RDTAComments1: "RDTAComments1",
    RDTAComments2: "RDTAComments2",
    RDTAComments3: "RDTAComments3",
    RDTAComments4: "RDTAComments4",
    RDTAComments5: "RDTAComments5",
    RDTAComments6: "RDTAComments6",
    RDTAComments7: "RDTAComments7",
    RDTAComments8: "RDTAComments8",
    RDTAComments9: "RDTAComments9",
    RDTAComments10: "RDTAComments10",

    LCComments1: "LCComments1",
    LCComments2: "LCComments2",
    LCComments3: "LCComments3",
    LCComments4: "LCComments4",
    LCComments5: "LCComments5",
    LCComments6: "LCComments6",
    LCComments7: "LCComments7",
    LCComments8: "LCComments8",
    LCComments9: "LCComments9",
    LCComments10: "LCComments10",

    POComments1: "POComments1",
    POComments2: "POComments2",
    POComments3: "POComments3",
    POComments4: "POComments4",
    POComments5: "POComments5",
    POComments6: "POComments6",
    POComments7: "POComments7",
    POComments8: "POComments8",
    POComments9: "POComments9",
    POComments10: "POComments10",

    RDCComments1: "RDCComments1",
    RDCComments2: "RDCComments2",
    RDCComments3: "RDCComments3",
    RDCComments4: "RDCComments4",
    RDCComments5: "RDCComments5",
    RDCComments6: "RDCComments6",
    RDCComments7: "RDCComments7",
    RDCComments8: "RDCComments8",
    RDCComments9: "RDCComments9",
    RDCComments10: "RDCComments10",

    BQ5: "OData__x0042_DQ5",
    BQ6: "OData__x0042_DQ6",
    BQ7: "OData__x0042_DQ7",
    BQ8: "OData__x0042_DQ8",
    BQ9: "OData__x0042_DQ9",
    BQ10: "OData__x0042_DQ10",
    
    RDQ6: "OData__x0052_DQ6",
    RDQ7: "OData__x0052_DQ7",
    RDQ8: "OData__x0052_DQ8",
    RDQ9: "OData__x0052_DQ9",
    RDQ10: "OData__x0052_DQ10",

    PD5: "OData__x0050_DQ5",
    PD6: "OData__x0050_DQ6",
    PD7: "OData__x0050_DQ7",
    PD8: "OData__x0050_DQ8",
    PD9: "OData__x0050_DQ9",
    PD10: "OData__x0050_DQ10",

    LC1: "OData__x004c_CQ1",
    LC2: "OData__x004c_CQ2",
    LC3: "OData__x004c_CQ3",
    LC4: "OData__x004c_CQ4",
    LC5: "OData__x004c_CQ5",
    LC6: "OData__x004c_CQ6",
    LC7: "OData__x004c_CQ7",
    LC8: "OData__x004c_CQ8",
    LC9: "OData__x004c_CQ9",
    LC10: "OData__x004c_CQ10",

    PO1: "OData__x0050_OQ1",
    PO2: "OData__x0050_OQ2",
    PO3: "OData__x0050_OQ3",
    PO4: "OData__x0050_OQ4",
    PO5: "OData__x0050_OQ5",
    PO6: "OData__x0050_OQ6",
    PO7: "OData__x0050_OQ7",
    PO8: "OData__x0050_OQ8",
    PO9: "OData__x0050_OQ9",
    PO10: "OData__x0050_OQ10",
    /* Deva Create End */
  };

  // Key Value pair of Project list column title and internal names
  export const ProjectListColumns = {
    ID: "ID",
    ProjectName: "Title",
    ProjectCode: "Project_x0020_Code",
    ReviewerName: "Reviewer_x0020_Name",
    LeadMDName: "Lead_x0020_MD_x0020_Name",
    HoursWorked: "Hours_x0020_Worked",
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    ProjectStatus: "Project_x0020_Status",
    ClientName: "Customer_x0020_Name",
    RevieweeName: "Reviewee_x0020_Name",
  };

  export const Links = {
    EmployeeSummaryListAllItems: "/Lists/Employee%20Summary/AllItems.aspx",
    HomePageLink: "/",
  };

  export const Strings = {
    NotApplicable: "NA",
    EmployeeAlreadyAdded:
      "Employee Details are already present for the current employee. Please select another employee name.",
  };
}
