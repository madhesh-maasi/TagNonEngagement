import * as React from "react";
import styles from "./SubmitCombineAdmin.module.scss";
import { ISubmitCombineAdminProps } from "./ISubmitCombineAdminProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react";
import {
  DateConvention,
  DateTimePicker,
  TimeConvention,
  TimeDisplayControlType,
} from "@pnp/spfx-controls-react";
import {
  ListView,
  IViewField,
  SelectionMode,
  GroupOrder,
  IGrouping,
} from "@pnp/spfx-controls-react/lib/ListView";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import ListItemService from "../../../services/ListItemService";
import { TAG_CombineAdmin } from "../../../domain/models/TAG_CombineAdmin";
import { TAG_ProjectListView } from "../../../domain/models/TAG_ProjectListView";
import { Config } from "../../../globals/Config";
import { SubmitCombineAdminState } from "./SubmitCombineAdminState";
import { Enums } from "../../../globals/Enums";
import MapResult from "../../../domain/mappers/MapResult";
import { Persona, PersonaSize } from "office-ui-fabric-react/lib/Persona";
import * as moment from "moment";

export default class SubmitCombineAdmin extends React.Component<
  ISubmitCombineAdminProps,
  SubmitCombineAdminState,
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
      displayName: "Project Name",
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
  //#endregion
  private JobTitleOptions: IDropdownOption[] = [];
  private ServiceLines: IDropdownOption[] = [];
  private ListItemService: ListItemService;
  private ProjectsListItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
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
      CombineAdmin: new TAG_CombineAdmin(),
      DisableSaveButton: true,
      IsShowForm: false,
      NewItemID: 0,
      ProjectListViewItems: [],
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

    this.onGETREVIEWS = this.onGETREVIEWS.bind(this);
    this.onChangeReviewerName = this.onChangeReviewerName.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeReviewIDs = this.onChangeReviewIDs.bind(this);
    this.onchangedLastDateHoursBilled =
      this.onchangedLastDateHoursBilled.bind(this);
    this.onChangeTitleofCombinedReview =
      this.onChangeTitleofCombinedReview.bind(this);
    this.onchangedProjectStartDate = this.onchangedProjectStartDate.bind(this);
    this.onchangedProjectEndDate = this.onchangedProjectEndDate.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeClientName = this.onChangeClientName.bind(this);
    this.onChangeServiceLines = this.onChangeServiceLines.bind(this);
  }
  public async componentDidMount() {
    this.FillJobTitleOptions();
    if (this.state.IsCreateMode) {
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      this.hasEditItemPermission =
        await this.ListItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const CombineAdminDetails: TAG_CombineAdmin =
        await this.ListItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.TAG_CombineAdmin
        );

      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        CombineAdmin: CombineAdminDetails,
        // IsShowForm: true,
      });
      this.bindListView();
    }
  }

  private async FillJobTitleOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.CombineAdmin
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.CombineAdminListColumns.JobTitle
    );
    let GetServiceLineOption: any[] = [];
    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qData = {};
        qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOption.push(qData);
      }
    }
    this.JobTitleOptions = GetServiceLineOption;
  }

  private async onChangeReviewerName(items: any[]) {
    let curretState = this.state.CombineAdmin;
    if (items != null && items.length > 0) {
      curretState.ReviewerName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.ReviewerNameEmail = curretState.ReviewerName.Email;
      this.setState({
        IsReviewerNameEnable:
          curretState.ReviewerName.Email != "" ? false : true,
      });
      this.onFormTextFieldValueChange(curretState);
    } else {
      this.setState({ IsReviewerNameEnable: true });
    }
  }

  private onChangeClientName(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValueText: string
  ): void {
    let curretState = this.state.CombineAdmin;
    curretState.ClientName = newValueText;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeServiceLines(newValue1: string): void {
    let curretState = this.state.CombineAdmin;
    curretState.ServiceLine = newValue1;
    this.onFormTextFieldValueChange(curretState);
  }

  private async onSave(): Promise<void> {
    const CombineAdmin = this.state.CombineAdmin;
    let data = {};
    const columns = Config.CombineAdminListColumns;
    data[Config.BaseColumns.Title] = CombineAdmin.Title;
    data[columns.ReviewIDs] = CombineAdmin.ReviewIDs;
    data[columns.JobTitle] = CombineAdmin.JobTitle;
    data[columns.LastHoursBilled] = CombineAdmin.LastHoursBilled;
    data[columns.RevieweeNameId] = CombineAdmin.ReviewerName.Id;
    data[columns.ProjectStartDate] = CombineAdmin.ProjectStartDate;
    data[columns.ProjectEndDate] = CombineAdmin.ProjectEndDate;
    data[columns.ClientName] = CombineAdmin.ClientName;
    data[columns.ServiceLine] = CombineAdmin.ServiceLine;

    if (this.state.IsCreateMode) {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      // await this.ListItemService.updateItem(this.state.NewItemID, data);
      await this.ListItemService.createItem(data);
      this.gotoListPage();
    } else {
      data[columns.StatusFlag] = "false";
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      await this.ListItemService.updateItem(this.props.ItemID, data);

      //await this.ListItemService.createItem(data);
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
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private onChangeReviewIDs(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineAdmin;
    curretState.ReviewIDs = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeTitleofCombinedReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineAdmin;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onchangedLastDateHoursBilled(date: any): void {
    let curretState = this.state.CombineAdmin;
    curretState.LastHoursBilled = date;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedProjectStartDate(date1: any): void {
    let curretState = this.state.CombineAdmin;
    curretState.ProjectStartDate = date1;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedProjectEndDate(date2: any): void {
    let curretState = this.state.CombineAdmin;
    curretState.ProjectEndDate = date2;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.CombineAdmin;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onFormTextFieldValueChange(updateDetails: TAG_CombineAdmin) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      CombineAdmin: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  private validateSave(updateDetails: TAG_CombineAdmin): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.Title != "" &&
      updateDetails.Title != undefined &&
      updateDetails.ReviewIDs != "" &&
      updateDetails.ReviewIDs != undefined &&
      updateDetails.ClientName != "" &&
      updateDetails.ClientName != undefined &&
      updateDetails.ServiceLine != "" &&
      updateDetails.ServiceLine != undefined &&
      updateDetails.ProjectStartDate != undefined &&
      updateDetails.ProjectEndDate != undefined &&
      updateDetails.JobTitle != "" &&
      updateDetails.JobTitle != undefined
    ) {
      valid = true;
    }
    return valid;
  }
  private _onFormatDate = (date: Date): string => {
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };
  private _onSelectDate = (date: Date | null | undefined): void => {};
  private async onGETREVIEWS(): Promise<void> {
    this.bindListView();
    // const CombineAdmin = this.state.CombineAdmin;
    // let data = {};
    // const columns = Config.CombineAdminListColumns;
    // data[columns.RevieweeNameId] = CombineAdmin.ReviewerName.Id;

    // if (this.state.IsCreateMode) {
    //   this.ListItemService = new ListItemService(this.props.AppContext, Config.ListNames.CombineAdmin);
    //   await this.ListItemService.createItem(data).then(r => {
    //     console.log(r);
    //     this.setState({ NewItemID: r.data.ID });
    //   });
    //   this.bindListView();

    // }
    // else {
    //   this.ListItemService = new ListItemService(this.props.AppContext, Config.ListNames.CombineAdmin);
    //   await this.ListItemService.updateItem(this.props.ItemID, data);

    // }
  }
  private async bindListView() {
    this.ProjectsListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.Projects
    );
    let _ProjectItem =
      await this.ProjectsListItemService.getProjectItemUsingCAML(
        this.state.CombineAdmin.ReviewerName.Id,
        [],
        undefined,
        Enums.ItemResultType.TAG_Projects
      );
    var _ProjectListViewItems: Array<TAG_ProjectListView> =
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
    this.setState({
      IsShowForm: true,
      ProjectListViewItems: _ProjectListViewItems,
    });
  }

  public render(): React.ReactElement<ISubmitCombineAdminProps> {
    function handleKeyPress(e) {
      var key = e.key;
      var regex = /[0-9]|\,/;
      if (!regex.test(key)) {
        e.preventDefault();
      } else {
        console.log("You pressed a key: " + key);
      }
    }
    return (
      <React.Fragment>
        <div className={styles.submitCombineAdmin}>
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
                    <b style={{ color: "#ff0000" }}>INSTRUCTIONS:</b> Choose a
                    Reviewee whose reviews you want to combine. Then onsult the
                    list of eligible ID numbers at the bottom of the page. Enter
                    two or more of these ID numbers in the designated textbox
                    below, separated by commas without spaces. Complete all
                    other required information and submit to create a new
                    Combined Review.
                  </Label>
                </div>
                <div className={styles.divCompetency}>
                  <Label>
                    <b>NOTE: </b>Once a review has been combined into another
                    review it can no longer be used. Use the Combined Review
                    instead.
                  </Label>
                </div>
                <hr className={styles.hr}></hr>
              </div>

              <div className={styles.row}>
                <div className={styles.lblTitle}>
                  <Label className={styles.lblText}>
                    <b>Reviewee Name</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReviewIDsTextBox1}>
                  {
                    <PeoplePicker
                      context={this.props.AppContext as any}
                      personSelectionLimit={1}
                      groupName={""} // Leave this blank in case you want to filter from all users
                      showtooltip={true}
                      ensureUser={true}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      onChange={this.onChangeReviewerName}
                      defaultSelectedUsers={[
                        this.state.CombineAdmin.ReviewerNameEmail,
                      ]}
                      resolveDelay={1000}
                    />
                  }
                </div>
                {(this.state.IsCreateMode ||
                  this.state.hasEditItemPermission) && (
                  <div className={styles.txtReviewIDsTextBox}>
                    <PrimaryButton
                      className={styles.btnGETREVIEW}
                      text="GET REVIEWS"
                      disabled={this.state.IsReviewerNameEnable}
                      onClick={this.onGETREVIEWS}
                    ></PrimaryButton>
                  </div>
                )}
              </div>

              {this.state.IsShowForm && (
                <div>
                  <div
                    style={{ paddingTop: "15px !important" }}
                    className={styles.row}
                  >
                    <div className={styles.lblTitle}>
                      <Label className={styles.lblText}>
                        <b>Review IDs to combine</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                        <br />
                        <b>
                          Separate with commas - no spaces. Example: 12,15,20
                        </b>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <TextField
                        onKeyPress={(e) => handleKeyPress(e)}
                        resizable={false}
                        multiline={false}
                        value={this.state.CombineAdmin.ReviewIDs}
                        onChange={this.onChangeReviewIDs}
                        className={styles.Multilinetextarea}
                      ></TextField>{" "}
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.lblTitle}>
                      <Label>
                        <b>Combined Review's Title</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <TextField
                        resizable={false}
                        multiline={false}
                        value={this.state.CombineAdmin.Title}
                        onChange={this.onChangeTitleofCombinedReview}
                        className={styles.Multilinetextarea}
                      ></TextField>{" "}
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.lblTitle}>
                      <Label>
                        <b>Client Name </b>{" "}
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <TextField
                        resizable={false}
                        multiline={false}
                        value={this.state.CombineAdmin.ClientName}
                        onChange={this.onChangeClientName}
                        className={styles.Multilinetextarea}
                      ></TextField>
                    </div>
                  </div>

                  <div
                    style={{ paddingTop: "15px !important" }}
                    className={styles.row}
                  >
                    <div className={styles.lblTitle}>
                      <Label>
                        <b>
                          Service Line
                          <span style={{ color: "#ff0000" }}> * </span>
                        </b>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <Dropdown
                        className={styles.dropServiceLine}
                        placeholder="Please Select a Value"
                        options={this.ServiceLines}
                        selectedKey={this.state.CombineAdmin.ServiceLine}
                        onChange={(e, selectedOption) => {
                          this.onChangeServiceLines(selectedOption.text);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{ paddingTop: "15px !important" }}
                    className={styles.row}
                  >
                    <div className={styles.lblTitle}>
                      <Label>
                        <b>Project Start Date </b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <DateTimePicker
                        dateConvention={DateConvention.Date}
                        timeConvention={TimeConvention.Hours12}
                        timeDisplayControlType={TimeDisplayControlType.Dropdown}
                        showLabels={false}
                        value={this.state.CombineAdmin.ProjectStartDate}
                        formatDate={this._onFormatDate}
                        onChange={this.onchangedProjectStartDate}
                      />
                    </div>
                  </div>

                  <div
                    style={{ paddingTop: "15px !important" }}
                    className={styles.row}
                  >
                    <div className={styles.lblTitle}>
                      <Label>
                        <b>Project End Date </b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <DateTimePicker
                        dateConvention={DateConvention.Date}
                        timeConvention={TimeConvention.Hours12}
                        timeDisplayControlType={TimeDisplayControlType.Dropdown}
                        showLabels={false}
                        value={this.state.CombineAdmin.ProjectEndDate}
                        formatDate={this._onFormatDate}
                        onChange={this.onchangedProjectEndDate}
                      />
                    </div>
                  </div>
                  <div
                    style={{ paddingTop: "15px !important" }}
                    className={styles.row}
                  >
                    <div
                      // style={{ width: "20% !important" }}
                      className={styles.lblTitle}
                    >
                      <Label>
                        <b>Last Date Hours Billed (If Known)</b>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDsTextBox1}>
                      <DateTimePicker
                        dateConvention={DateConvention.Date}
                        timeConvention={TimeConvention.Hours12}
                        timeDisplayControlType={TimeDisplayControlType.Dropdown}
                        showLabels={false}
                        value={this.state.CombineAdmin.LastHoursBilled}
                        formatDate={this._onFormatDate}
                        onChange={this.onchangedLastDateHoursBilled}
                      />
                    </div>
                  </div>
                  <div
                    style={{ paddingTop: "15px !important" }}
                    className={styles.row}
                  >
                    <div
                      // style={{ width: "20% !important" }}
                      className={styles.lblTitle}
                    >
                      <Label>
                        <b>Job Title</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>{" "}
                    <div className={styles.txtReviewIDsTextBox1}>
                      <Dropdown
                        className={styles.dropServiceLine}
                        options={this.JobTitleOptions}
                        selectedKey={this.state.CombineAdmin.JobTitle}
                        placeholder="Please Select Value"
                        onChange={(e, selectedOption) => {
                          this.onChangeJobTitle(selectedOption.text);
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.btnleft}>
                    {(this.state.IsCreateMode ||
                      this.state.hasEditItemPermission) && (
                      <PrimaryButton
                        className={
                          this.state.DisableSaveButton
                            ? styles.btnSave
                            : styles.btnSaveEnable
                        }
                        disabled={this.state.DisableSaveButton}
                        text="CREATE COMBINED REVIEW"
                        onClick={this.onSave}
                      ></PrimaryButton>
                    )}
                    <PrimaryButton
                      className={styles.btnCancel}
                      text="Cancel"
                      onClick={this.onCancel}
                    ></PrimaryButton>
                  </div>
                  <div className={styles.row}></div>
                  <div className={styles.row}></div>
                  <div className={styles.row}>
                    {" "}
                    <Label className={styles.Viewlblfontsize}>
                      <b>Unstarted, Uncombined reviews.</b>
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
                      stickyHeader={true}
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
