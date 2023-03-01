import * as React from "react";
import styles from "./SubmitSplitAdmin.module.scss";
import { ISubmitSplitAdminProps } from "./ISubmitSplitAdminProps";
import { escape, update } from "@microsoft/sp-lodash-subset";
import {
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react";
import { SubmitSplitAdminState } from "./SubmitSplitAdminState";
import ListItemService from "../../../services/ListItemService";
import { Config } from "../../../globals/Config";
import MapResult from "../../../domain/mappers/MapResult";
import { Enums } from "../../../globals/Enums";
import { TAG_SplitAdmin } from "../../../domain/models/TAG_SplitAdmin";
import { TAG_ProjectListView } from "../../../domain/models/TAG_ProjectListView";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import {
  ListView,
  IViewField,
  SelectionMode,
  GroupOrder,
  IGrouping,
} from "@pnp/spfx-controls-react/lib/ListView";
import { Persona, PersonaSize } from "office-ui-fabric-react/lib/Persona";
import * as moment from "moment";

export default class SubmitSplitAdmin extends React.Component<
  ISubmitSplitAdminProps,
  SubmitSplitAdminState,
  {}
> {
  //#region  ViewFields
  private viewFields: IViewField[] = [
    {
      name: "ID",
      displayName: "ID",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 50,
      maxWidth: 50,
    },
    {
      name: "ProjectName",
      displayName: "Title",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
    {
      name: "ProjectCode",
      displayName: "Project Code",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
    {
      name: "RevieweeName",
      displayName: "Reviewee Name",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return (
          <Persona
            size={PersonaSize.size24}
            showInitialsUntilImageLoads
            imageShouldStartVisible
            text={item["RevieweeName.Title"]}
            imageUrl={`/_layouts/15/userphoto.aspx?username=${item["RevieweeName.EMail"]}&size=M`}
          />
        );
      },
    },
    {
      name: "LeadMDName",
      displayName: "Lead MD Name",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return (
          <Persona
            size={PersonaSize.size24}
            showInitialsUntilImageLoads
            imageShouldStartVisible
            text={item["LeadMDName.Title"]}
            imageUrl={`/_layouts/15/userphoto.aspx?username=${item["LeadMDName.EMail"]}&size=M`}
          />
        );
      },
    },
    {
      name: "HoursWorked",
      displayName: "Hours Worked",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
    {
      name: "ProjectStartDate",
      displayName: "Project Start Date",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return <div>{moment(item.ProjectStartDate).format("MM/DD/YYYY")}</div>;
      },
    },
    {
      name: "ProjectEndDate",
      displayName: "Project End Date",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return <div>{moment(item.ProjectEndDate).format("MM/DD/YYYY")}</div>;
      },
    },
    {
      name: "LastHoursBilled",
      displayName: "Last Hours Billed",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return <div>{moment(item.LastHoursBilled).format("MM/DD/YYYY")}</div>;
      },
    },
    {
      name: "ProjectStatus",
      displayName: "ProjectStatus",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
  ];
  private viewFields1: IViewField[] = [
    {
      name: "ID",
      displayName: "ID",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 50,
      maxWidth: 50,
    },
    {
      name: "ProjectName",
      displayName: "Title",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
    {
      name: "ProjectCode",
      displayName: "Project Code",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
    {
      name: "RevieweeName",
      displayName: "Reviewee Name",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return (
          <Persona
            size={PersonaSize.size24}
            showInitialsUntilImageLoads
            imageShouldStartVisible
            text={item["RevieweeName.Title"]}
            imageUrl={`/_layouts/15/userphoto.aspx?username=${item["RevieweeName.EMail"]}&size=M`}
          />
        );
      },
    },
    {
      name: "LeadMDName",
      displayName: "Lead MD Name",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return (
          <Persona
            size={PersonaSize.size24}
            showInitialsUntilImageLoads
            imageShouldStartVisible
            text={item["LeadMDName.Title"]}
            imageUrl={`/_layouts/15/userphoto.aspx?username=${item["LeadMDName.EMail"]}&size=M`}
          />
        );
      },
    },
    {
      name: "HoursWorked",
      displayName: "Hours Worked",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
    },
    {
      name: "ProjectStartDate",
      displayName: "Project Start Date",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 125,
      render: (item?: any, index?: number) => {
        return <div>{moment(item.ProjectStartDate).format("MM/DD/YYYY")}</div>;
      },
    },
    {
      name: "ProjectEndDate",
      displayName: "Project End Date",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 125,
      render: (item?: any, index?: number) => {
        return <div>{moment(item.ProjectEndDate).format("MM/DD/YYYY")}</div>;
      },
    },
    {
      name: "LastHoursBilled",
      displayName: "Last Hours Billed",
      //linkPropertyName: "c",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 100,
      render: (item?: any, index?: number) => {
        return <div>{moment(item.LastHoursBilled).format("MM/DD/YYYY")}</div>;
      },
    },
  ];
  //#endregion

  private listSplitAdminItemService: ListItemService;
  private ProjectsListItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
  private ServiceLines: IDropdownOption[] = [];
  private JobTitleOptions: IDropdownOption[] = [
    { key: "Analyst", text: "Analyst" },
    { key: "Associate", text: "Associate" },
    { key: "Senior Associate", text: "Senior Associate" },
    { key: "Manager", text: "Manager" },
    { key: "Senior Manager", text: "Senior Manager" },
    { key: "Director", text: "Director" },
    { key: "Senior Director", text: "Senior Director" },
  ];
  constructor(props: any) {
    super(props);
    this.state = {
      IsCreateMode:
        this.props.ItemID == undefined ||
        this.props.ItemID == null ||
        this.props.ItemID == 0
          ? true
          : false,
      hasEditItemPermission: false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      DisableSaveButton: true,
      SplitAdmin: new TAG_SplitAdmin(),
      IsShowForm: false,
      NewItemID: 0,
      ProjectListViewItems: [],
      ProjectList_StatusOfReviewSplitViewItems: [],
      Project_AllProjectStatusSplitListViewItems: [],
      IsReviewerNameEnable: true,
    };
    let dropDownOption: any[] = [];
    dropDownOption.push({
      key: "Capital Markets & Accounting Advisory",
      text: "Capital Markets & Accounting Advisory",
    });
    dropDownOption.push({
      key: "Financial Due Diligence",
      text: "Financial Due Diligence",
    });
    dropDownOption.push({
      key: "Global Transaction Analytics",
      text: "Global Transaction Analytics",
    });
    this.ServiceLines = dropDownOption;
    this.onChangeReviewerName = this.onChangeReviewerName.bind(this);
    this.onGETREVIEWS = this.onGETREVIEWS.bind(this);

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeSourceReviewID = this.onChangeSourceReviewID.bind(this);
    this.onChangeHourstoReview = this.onChangeHourstoReview.bind(this);
    this.onChangeTitleofnewSplitReview =
      this.onChangeTitleofnewSplitReview.bind(this);

    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeServiceLines = this.onChangeServiceLines.bind(this);
  }
  public async componentDidMount() {
    if (this.state.IsCreateMode) {
    } else {
      this.listSplitAdminItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SplitAdmin
      );
      this.hasEditItemPermission =
        await this.listSplitAdminItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const SplitAdminDetails: TAG_SplitAdmin =
        await this.listSplitAdminItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.TAG_SplitAdmin
        );

      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        SplitAdmin: SplitAdminDetails,
        //IsShowForm: true,
      });
      this.bindListView();
    }
  }
  private async onChangeReviewerName(items: any[]) {
    let curretState = this.state.SplitAdmin;
    if (items != null && items.length > 0) {
      curretState.RevieweeName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.RevieweeNameEmail = curretState.RevieweeName.Email;
      this.setState({
        IsReviewerNameEnable:
          curretState.RevieweeName.Email != "" ? false : true,
      });
      this.onFormTextFieldValueChange(curretState);
    } else {
      this.setState({ IsReviewerNameEnable: true });
    }
  }
  private async onGETREVIEWS(): Promise<void> {
    this.bindListView();
    // const CombineAdmin = this.state.SplitAdmin;
    // let data = {};
    // const columns = Config.CombineAdminListColumns;
    // data[columns.RevieweeNameId] = CombineAdmin.RevieweeName.Id;

    // if (this.state.IsCreateMode) {
    //   this.listSplitAdminItemService = new ListItemService(this.props.AppContext, Config.ListNames.SplitAdmin);
    //   debugger;
    //   await this.listSplitAdminItemService.createItem(data).then(r => {
    //     console.log(r);
    //     //r.data.ID
    //     this.setState({ NewItemID: r.data.ID });
    //   });

    //   //this.setState({ IsShowForm: true });
    // }
  }

  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private async onSave(): Promise<void> {
    const SplitAdmin = this.state.SplitAdmin;
    let data = {};
    const columns = Config.SplitAdminListColumns;
    data[Config.BaseColumns.Title] = SplitAdmin.Title;
    data[columns.HourstoReview] = Number(
      SplitAdmin.HourstoReview.replace(/,/g, "")
    );

    //var new_str = SplitAdmin.SourceReviewID.replace(/,/g, '');
    data[columns.SourceReviewID] = Number(
      SplitAdmin.SourceReviewID.replace(/,/g, "")
    );
    data[columns.RevieweeNameId] = SplitAdmin.RevieweeName.Id;
    data[columns.JobTitle] = SplitAdmin.JobTitle;
    data[columns.ServiceLine] = SplitAdmin.ServiceLine;

    if (this.state.IsCreateMode) {
      this.listSplitAdminItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SplitAdmin
      );
      await this.listSplitAdminItemService.createItem(data);
      //await this.listSplitAdminItemService.updateItem(this.state.NewItemID, data);
      this.gotoListPage();
    } else {
      data[columns.StatusFlag] = "false";
      this.listSplitAdminItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SplitAdmin
      );
      await this.listSplitAdminItemService.updateItem(this.props.ItemID, data);
      this.gotoListPage();
    }
  }

  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  private onChangeSourceReviewID(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    const re = /^[0-9\b]+$/;

    let curretState = this.state.SplitAdmin;
    curretState.SourceReviewID = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeHourstoReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    const re = /^[0-9\b]+$/;

    let curretState = this.state.SplitAdmin;
    curretState.HourstoReview = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeTitleofnewSplitReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.SplitAdmin;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.SplitAdmin;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeServiceLines(newValue1: string): void {
    let curretState = this.state.SplitAdmin;
    curretState.ServiceLine = newValue1;
    this.onFormTextFieldValueChange(curretState);
  }
  private onFormTextFieldValueChange(updateDetails: TAG_SplitAdmin) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      SplitAdmin: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  private validateSave(updateDetails: TAG_SplitAdmin): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.ServiceLine != "" &&
      updateDetails.ServiceLine != undefined &&
      updateDetails.SourceReviewID != undefined &&
      updateDetails.SourceReviewID != "" &&
      updateDetails.HourstoReview != undefined &&
      updateDetails.HourstoReview != "" &&
      updateDetails.Title != undefined &&
      updateDetails.Title != "" &&
      updateDetails.JobTitle != undefined &&
      updateDetails.JobTitle != ""
    ) {
      valid = true;
    }
    return valid;
  }
  private async bindListView() {
    this.ProjectsListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.Projects
    );
    let _ProjectItem =
      await this.ProjectsListItemService.getProjectItemUsingCAML(
        this.state.SplitAdmin.RevieweeName.Id,
        [],
        undefined,
        Enums.ItemResultType.TAG_Projects
      );
    let _ProjectItem_StatusOfReviewSplit =
      await this.ProjectsListItemService.getProjectItemUsingCAMLStatusOfReviewSplit(
        this.state.SplitAdmin.RevieweeName.Id,
        [],
        undefined,
        Enums.ItemResultType.TAG_Projects
      );
    let _ProjectItem_AllProjectStatusSplit =
      await this.ProjectsListItemService.getProjectItemUsingCAMLAllProjectStatusSplit(
        this.state.SplitAdmin.RevieweeName.Id,
        [],
        undefined,
        Enums.ItemResultType.TAG_Projects
      );
    var _ProjectListViewItems: Array<TAG_ProjectListView> =
      new Array<TAG_ProjectListView>();
    var _ProjectList_StatusOfReviewSplitViewItems: Array<TAG_ProjectListView> =
      new Array<TAG_ProjectListView>();
    var _Project_AllProjectStatusSplitListViewItems: Array<TAG_ProjectListView> =
      new Array<TAG_ProjectListView>();

    if (_ProjectItem != undefined) {
      _ProjectItem.map((item) => {
        _ProjectListViewItems.push({
          ID: item.ID,
          ProjectName: item.ProjectName,
          ProjectCode: item.ProjectCode,
          RevieweeName: item.RevieweeName,
          ReviewerName: item.ReviewerName,
          LeadMDName: item.LeadMDName,
          HoursWorked: item.HoursWorked,
          ProjectStartDate: item.ProjectStartDate,
          ProjectEndDate: item.ProjectEndDate,
          LastHoursBilled: item.LastHoursBilled,
          ProjectStatus: item.ProjectStatus,
        });
      });
    }
    if (_ProjectItem_StatusOfReviewSplit != undefined) {
      _ProjectItem_StatusOfReviewSplit.map((item) => {
        _ProjectList_StatusOfReviewSplitViewItems.push({
          ID: item.ID,
          ProjectName: item.ProjectName,
          ProjectCode: item.ProjectCode,
          RevieweeName: item.RevieweeName,
          ReviewerName: item.ReviewerName,
          LeadMDName: item.LeadMDName,
          HoursWorked: item.HoursWorked,
          ProjectStartDate: item.ProjectStartDate,
          ProjectEndDate: item.ProjectEndDate,
          LastHoursBilled: item.LastHoursBilled,
          ProjectStatus: item.ProjectStatus,
        });
      });
    }
    if (_ProjectItem_AllProjectStatusSplit != undefined) {
      _ProjectItem_AllProjectStatusSplit.map((item) => {
        _Project_AllProjectStatusSplitListViewItems.push({
          ID: item.ID,
          ProjectName: item.ProjectName,
          ProjectCode: item.ProjectCode,
          RevieweeName: item.RevieweeName,
          ReviewerName: item.ReviewerName,
          LeadMDName: item.LeadMDName,
          HoursWorked: item.HoursWorked,
          ProjectStartDate: item.ProjectStartDate,
          ProjectEndDate: item.ProjectEndDate,
          LastHoursBilled: item.LastHoursBilled,
          ProjectStatus: item.ProjectStatus,
        });
      });
    }
    this.setState({
      IsShowForm: true,
      ProjectListViewItems: _ProjectListViewItems,
      ProjectList_StatusOfReviewSplitViewItems:
        _ProjectList_StatusOfReviewSplitViewItems,
      Project_AllProjectStatusSplitListViewItems:
        _Project_AllProjectStatusSplitListViewItems,
    });
  }
  public render(): React.ReactElement<ISubmitSplitAdminProps> {
    return (
      <React.Fragment>
        <div className={styles.submitSplitAdmin}>
          <div className={styles.container}>
            <img
              src={require("../../../assets/Images/performancemgmtgraphic.png")}
              alt="Performance Management"
              className="fullimg"
            />
            <hr className={styles.hr}></hr>
            <div className={styles.row}>
              <div className={styles.lblTopText}>
                <div className={styles.divCompetency}>
                  <Label>
                    <b style={{ color: "#ff0000" }}>INSTRUCTIONS: </b>Identify
                    the Reviewee and get the associated reviews. Then locate the
                    ID number of the review you would like to split into an
                    additional review. You may split any unstarted review into
                    an additional review, even if it has been split before.
                    Consult the lists below for reviews you are eligible to
                    split.
                  </Label>
                </div>
                <div className={styles.divCompetency}>
                  <Label>
                    You may not split reviews which have already started, nor
                    can you split reviews previously combined.
                  </Label>
                </div>
                <hr className={styles.hr}></hr>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label className={styles.lblText}>
                    <b>Reviewee Name</b>
                    <span style={{ color: "#ff0000" }}>*</span>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  {
                    <PeoplePicker
                      context={this.props.AppContext}
                      personSelectionLimit={1}
                      groupName={""} // Leave this blank in case you want to filter from all users
                      showtooltip={true}
                      ensureUser={true}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      onChange={this.onChangeReviewerName}
                      defaultSelectedUsers={[
                        this.state.SplitAdmin.RevieweeNameEmail,
                      ]}
                      resolveDelay={1000}
                    />
                  }
                </div>
                {(this.state.IsCreateMode ||
                  this.state.hasEditItemPermission) && (
                  <div className={styles.txtReviewIDs}>
                    <PrimaryButton
                      className={styles.btnGETREVIEW}
                      text="GET REVIEWS"
                      onClick={this.onGETREVIEWS}
                      disabled={this.state.IsReviewerNameEnable}
                    ></PrimaryButton>
                  </div>
                )}
              </div>

              {this.state.IsShowForm && (
                <div>
                  <div className={styles.row}>
                    <div>
                      <div className={styles.lblReviewIDs}>
                        <Label className={styles.lblText}>
                          <b>Source Review ID (Choose from below): </b>
                          <span style={{ color: "#ff0000" }}>*</span>
                        </Label>
                      </div>
                      <div className={styles.txtReviewIDs}>
                        {" "}
                        <TextField
                          resizable={false}
                          multiline={false}
                          value={this.state.SplitAdmin.SourceReviewID}
                          onChange={this.onChangeSourceReviewID}
                        ></TextField>{" "}
                      </div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <div className={styles.lblReviewIDs}>
                        {" "}
                        <Label className={styles.lblText}>
                          <b>Hours to Review </b>
                          <span style={{ color: "#ff0000" }}>*</span>
                        </Label>
                      </div>
                      <div className={styles.txtReviewIDs}>
                        <TextField
                          resizable={false}
                          multiline={false}
                          value={this.state.SplitAdmin.HourstoReview}
                          onChange={this.onChangeHourstoReview}
                        ></TextField>{" "}
                      </div>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.lblReviewIDs}>
                      <Label className={styles.lblText}>
                        <b>Title of new Split Review</b> <br />
                        <b>
                          (Example: Acme Software Implementation - Phase 1){" "}
                        </b>
                        <span style={{ color: "#ff0000" }}>*</span>{" "}
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDs}>
                      <TextField
                        resizable={false}
                        multiline={false}
                        value={this.state.SplitAdmin.Title}
                        onChange={this.onChangeTitleofnewSplitReview}
                      ></TextField>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.lblReviewIDs}>
                      {" "}
                      <Label className={styles.lblText}>
                        <b>
                          Service Line:
                          <span style={{ color: "#ff0000" }}>*</span>
                        </b>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDs}>
                      <Dropdown
                        className={styles.dropServiceLine}
                        placeholder="Please Select a Value"
                        options={this.ServiceLines}
                        selectedKey={this.state.SplitAdmin.ServiceLine}
                        onChange={(e, selectedOption) => {
                          this.onChangeServiceLines(selectedOption.text);
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.lblReviewIDs}>
                      {" "}
                      <Label className={styles.lblText}>
                        <b>
                          Job Title<span style={{ color: "#ff0000" }}>*</span>
                        </b>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDs}>
                      <Dropdown
                        className={styles.dropServiceLine}
                        placeholder="Please Select a Value"
                        options={this.JobTitleOptions}
                        selectedKey={this.state.SplitAdmin.JobTitle}
                        onChange={(e, selectedOption) => {
                          this.onChangeJobTitle(selectedOption.text);
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.divFullWidth}>
                    {(this.state.IsCreateMode ||
                      this.state.hasEditItemPermission) && (
                      <PrimaryButton
                        className={
                          this.state.DisableSaveButton
                            ? styles.btnSave
                            : styles.btnSaveEnable
                        }
                        disabled={this.state.DisableSaveButton}
                        text="CREATE SPLIT REVIEW"
                        onClick={this.onSave}
                      ></PrimaryButton>
                    )}
                    <PrimaryButton
                      className={styles.btnCancel}
                      text="Cancel"
                      onClick={this.onCancel}
                    ></PrimaryButton>
                  </div>

                  <div className={styles.row}> </div>
                  <div className={styles.row}>
                    {" "}
                    <Label className={styles.Viewlblfontsize}>
                      <b>
                        Unstarted project reviews not previously split. You may
                        split any of these.
                      </b>
                    </Label>
                  </div>
                  <div>
                    <ListView
                      items={this.state.ProjectListViewItems}
                      viewFields={this.viewFields}
                      iconFieldName=""
                      compact={true}
                      selectionMode={SelectionMode.multiple}
                      showFilter={true}
                      defaultFilter=""
                      filterPlaceHolder="Search..."
                      dragDropFiles={false}
                      stickyHeader={false}
                    />
                  </div>
                  <div className={styles.row}> </div>
                  <div className={styles.row}>
                    {" "}
                    <Label className={styles.Viewlblfontsize}>
                      <b>
                        Unstarted project reviews previously split. You may
                        split these again.
                      </b>
                    </Label>
                  </div>
                  <div>
                    <ListView
                      items={
                        this.state.ProjectList_StatusOfReviewSplitViewItems
                      }
                      viewFields={this.viewFields1}
                      iconFieldName=""
                      compact={true}
                      selectionMode={SelectionMode.multiple}
                      showFilter={true}
                      defaultFilter=""
                      filterPlaceHolder="Search..."
                      dragDropFiles={false}
                      stickyHeader={false}
                    />
                  </div>
                  <div className={styles.row}> </div>

                  <div className={styles.row}>
                    {" "}
                    <Label className={styles.Viewlblfontsize}>
                      <b>
                        Individual split reviews - for information only. You may
                        not split these again.
                      </b>
                    </Label>
                  </div>
                  <div>
                    <ListView
                      items={
                        this.state.Project_AllProjectStatusSplitListViewItems
                      }
                      viewFields={this.viewFields1}
                      iconFieldName=""
                      compact={true}
                      selectionMode={SelectionMode.multiple}
                      showFilter={true}
                      defaultFilter=""
                      filterPlaceHolder="Search..."
                      dragDropFiles={false}
                      stickyHeader={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
