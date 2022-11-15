import React from 'react';
import Layout from "../components/Layout";
import {
    AddIcon,
    Alert, Badge,
    Button,
    Card, Combobox,
    CrossIcon,
    DocumentOpenIcon,
    DoubleChevronRightIcon,
    FileCard,
    FileRejectionReason,
    FileUploader,
    Group,
    Heading,
    IconButton,
    majorScale,
    Pane,
    rebaseFiles,
    SelectField,
    SideSheet,
    Tab,
    Table,
    Tablist,
    TextareaField,
    TextInputField,
    TickIcon,
    TrashIcon
} from "evergreen-ui";
import {
    createNewApplication,
    deleteApplication,
    deleteDocument,
    getApplications,
    getDocuments,
    updateApplication,
    uploadDocument
} from "../utils/api";
import app from "../App";


function Dashboard() {
    const [navOption, setNavOption] = React.useState('all');
    const [applications, setApplications] = React.useState(null);
    const [documents, setDocuments] = React.useState(null);
    const [addApplication, setAddApplication] = React.useState(false);
    const [editApplication, setEditApplication] = React.useState(false);
    const [applicationID, setApplicationID] = React.useState();
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [filterBy, setFilterBy] = React.useState(false);
    const [filterTable, setFilterTable] = React.useState(false);


    const [companyName, setCompanyName] = React.useState('');
    const [position, setPosition] = React.useState('');
    let [applicationDeadline, setApplicationDeadline] = React.useState(new Date().toISOString().split('T')[0]);
    const [jobDescription, setJobDescription] = React.useState('');
    const [additionalNotes, setAdditionalNotes] = React.useState('');
    const [applicationStatus, setApplicationStatus] = React.useState(false);
    const [progressLevel, setProgressLevel] = React.useState(null);
    const [assessmentCompleted, setAssessmentCompleted] = React.useState(null);
    const [applicationOffer, setApplicationOffer] = React.useState(null);
    const [interviewCallCompleted, setInterviewCallCompleted] = React.useState(null);
    const [interviewFinalCompleted, setInterviewFinalCompleted] = React.useState(null);
    const [applicationDocument, setApplicationDocuments] = React.useState([]);
    const [rerender, setRerender] = React.useState(false);

    const acceptedMimeTypes = [MimeType.pdf]
    const maxFiles = 5
    const maxSizeInBytes = 50 * 1024 ** 2 // 50 MB
    const [files, setFiles] = React.useState([]);
    const [fileRejections, setFileRejections] = React.useState([]);
    const values = React.useMemo(() => [...files, ...fileRejections.map((fileRejection) => fileRejection.file)], [
        files,
        fileRejections,
    ]);


    const handleRemove = React.useCallback(
        (file) => {
            const updatedFiles = files.filter((existingFile) => existingFile !== file)
            const updatedFileRejections = fileRejections.filter((fileRejection) => fileRejection.file !== file)

            // Call rebaseFiles to ensure accepted + rejected files are in sync (some might have previously been
            // rejected for being over the file count limit, but might be under the limit now!)
            const {accepted, rejected} = rebaseFiles(
                [...updatedFiles, ...updatedFileRejections.map((fileRejection) => fileRejection.file)],
                {acceptedMimeTypes, maxFiles, maxSizeInBytes}
            )

            setFiles(accepted)
            setFileRejections(rejected)
        },
        [acceptedMimeTypes, files, fileRejections, maxFiles, maxSizeInBytes]
    )

    const fileCountOverLimit = files.length + fileRejections.length - maxFiles
    const fileCountError = `You can upload up to 5 files. Please remove ${fileCountOverLimit} ${
        fileCountOverLimit === 1 ? 'file' : 'files'
    }.`

    const refreshTab = async () => {
        const response = await getApplications();
        setApplications(response);

        const responseDocs = await getDocuments();
        setDocuments(responseDocs);
    }

    const onTabClose = () => {
        setFiles([]);
        setFileRejections([]);
        setAddApplication(false);
        setEditApplication(false);
        setSelectedIndex(0);
        setCompanyName('');
        setPosition('');
        setJobDescription('');
        setAdditionalNotes('');
        setApplicationDeadline(new Date().toISOString().split('T')[0]);
        setApplicationStatus(false);
        setInterviewCallCompleted(false);
        setAssessmentCompleted(false);
        setInterviewFinalCompleted(false);
        setProgressLevel(null);
    }

    const showApplication = (applicationId, company_name, position, application_deadline, job_description, additional_notes, application_status, progress_level) => {
        setEditApplication(true);
        setApplicationID(applicationId);
        setCompanyName(company_name);
        setPosition(position);
        setApplicationDeadline(application_deadline);
        setJobDescription(job_description);
        setAdditionalNotes(additional_notes);
        setApplicationStatus(application_status);
        setProgressLevel(progress_level);
    }

    const onClickedDeleteDocument = async (document_id) => {
        await deleteDocument(document_id).then(() => console.log('deleted document'));
        const updatedDocs = documents.results.filter(document => !(document.id === document_id));
        const docs = updatedDocs.filter(document => document.applicationId === applicationID);
        setDocuments(updatedDocs);
        setApplicationDocuments(docs);
    }

    const onClickedDelete = async (application_id) => {
        applicationDocument.map(async file => {
            await deleteDocument(file.id).then(() => console.log('deleted document'));
        });
        await deleteApplication(application_id).then(() => {
            console.log('delete application successful')
            onTabClose();
        });
        await refreshTab();
    };

    const onClickedSave = async () => {
        const applicationId = await createNewApplication(
            companyName,
            position,
            jobDescription,
            additionalNotes,
            applicationDeadline,
            applicationStatus,
            interviewCallCompleted,
            assessmentCompleted,
            interviewFinalCompleted,
            progressLevel
        );

        files.map(async file => {
            await uploadDocument(applicationId, file.name, file, 'document').then(() => console.log('uploaded document'));
        });
        await refreshTab();
        onTabClose();


    }

    const onClickedUpdate = async (application_id, company_name, job_position, job_description, additional_notes, application_deadline, application_status, interview_call, assessment, interview_final, progress, job_offer,job_accepted) => {
        await updateApplication(
            application_id,
            company_name,
            job_position,
            job_description,
            additional_notes,
            application_deadline,
            application_status,
            interview_call,
            assessment,
            interview_final,
            progress,
            job_offer,
            job_accepted
        );

        files.map(async file => {
            await uploadDocument(applicationID, file.name, file, 'document').then(() => console.log('uploaded document'));
        });
        await refreshTab();
        onTabClose();


    }


    React.useEffect(() => {
        const getUserApplications = async () => {
            const response = await getApplications();
            setApplications(response);
        }

        const getUserDocuments = async () => {
            const response = await getDocuments();
            setDocuments(response);
        }

        if (applications == null) {
            getUserApplications().then(() => {
                console.log('retrieved user applications.');
            });
        }

        if (documents == null) {
            getUserDocuments().then(() => {
                console.log('retrieved documents')
            })
        }
    }, [applications, documents, rerender])


    return (
        <Layout>
            <Pane display="flex" padding={20}>
                <Pane flex={1} alignItems="center" display="flex">
                    <Group size="medium">
                        <Button onClick={() => {
                            setNavOption("all")
                            setFilterTable(false);
                        }} appearance={navOption === "all" ? 'primary' : 'null'}>All</Button>
                        <Button onClick={() => {
                            setNavOption("draft");
                            setFilterTable(true);
                            setFilterBy(false);
                        }} appearance={navOption === "draft" ? 'primary' : 'null'}>Not Applied</Button>
                        <Button onClick={() => {
                            setFilterTable(true);
                            setFilterBy(true);
                            setNavOption("applied")
                        }} appearance={navOption === "applied" ? 'primary' : 'null'}>Applied</Button>
                    </Group>
                </Pane>
                <Button
                    size={"medium"}
                    background={"#FFFFFF"}
                    border={'0.5px solid #D9D9D9'}
                    boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
                    borderRadius={'8px'}
                    width={150}
                    height={40}
                    marginRight={16}
                    iconBefore={AddIcon}
                    fontFamily={'Cairo'}
                    fontWeight={'bold'}
                    fontSize={'13'}
                    onClick={() => {
                        setAddApplication(true)
                    }}
                >
                    Add Application
                </Button>
            </Pane>

            <SideSheet
                isShown={(addApplication || editApplication)}
                onCloseComplete={() => {
                    onTabClose();
                }}
                containerProps={{display: 'flex', flex: '1', flexDirection: 'column'}}
                preventBodyScrolling
            >
                <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
                    <Pane display="flex" padding={16}>
                        <Pane flex={1} alignItems="center" display="flex">
                            {addApplication ?
                                <Heading fontFamily={'Cairo'} fontWeight={'bold'} size={700}>New Application</Heading>
                                :
                                <>
                                    <Heading fontFamily={'Cairo'} fontWeight={'bold'} size={700}>{companyName}</Heading>
                                </>

                            }
                        </Pane>
                        {editApplication ?
                            <>
                                <Pane alignItems={"center"}>
                                    <Button
                                        appearance={"primary"}
                                        intent={"danger"}
                                        marginRight={16}
                                        onClick={() => {
                                            onClickedDelete(applicationID).then(r => console.log(r));
                                            setAddApplication(false)
                                        }}
                                    >
                                        DELETE
                                    </Button>
                                </Pane>
                                <Pane alignItems={"center"}>
                                    <Button
                                        appearance={"primary"}
                                        marginRight={16}
                                        onClick={() => {
                                            onClickedUpdate(
                                                applicationID,
                                                companyName,
                                                position,
                                                jobDescription,
                                                additionalNotes,
                                                applicationDeadline,
                                                applicationStatus,
                                                interviewCallCompleted,
                                                assessmentCompleted,
                                                interviewFinalCompleted,
                                                progressLevel,
                                                false,
                                                null
                                            ).then(() => console.log('application updated.'));
                                            setAddApplication(false)
                                        }}
                                    >
                                        UPDATE
                                    </Button>
                                </Pane>
                            </>
                            :
                            <Pane alignItems={"center"}>
                                <Button
                                    size={"medium"}
                                    appearance={"primary"}
                                    marginRight={16}
                                    onClick={() => {
                                        onClickedSave().then(r => console.log(r));
                                        setAddApplication(false)
                                    }}
                                >
                                    SAVE
                                </Button>
                            </Pane>
                        }
                    </Pane>


                    <Pane display="flex" padding={8}>
                        <Tablist>
                            {['Role Information', 'Documents'].map((tab, index) => (
                                <Tab
                                    key={tab}
                                    isSelected={selectedIndex === index}
                                    onSelect={() => setSelectedIndex(index)}
                                    fontFamily={'Cairo'} fontWeight={'bold'}
                                >
                                    {tab}
                                </Tab>
                            ))}
                        </Tablist>
                    </Pane>
                </Pane>

                {selectedIndex === 0 &&
                    <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
                        <Card
                            background={"#FFFFFF"}
                            border={'0.5px solid #D9D9D9'}
                            boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
                            borderRadius={'8px'}
                            padding={5}
                            elevation={30}
                            height={'100%'}
                            alignItems="flex-start"

                        >
                            <Pane>
                                <Pane display="flex">
                                    <TextInputField
                                        required
                                        onChange={e => setCompanyName(e.target.value)}
                                        label={"Company Name"}
                                        value={companyName}
                                        placeholder={"Morgan Stanley"}
                                        type={"name"}
                                        inputWidth={250}
                                        inputHeight={35}
                                        margin={15}
                                        textAlign={"left"}
                                        className={{fontFamily: 'Cairo',fontWeight:'bold', color:'black'}}

                                    />
                                    <TextInputField
                                        required
                                        onChange={e => setPosition(e.target.value)}
                                        label={"Position"}
                                        value={position}
                                        placeholder={"Software Engineer"}
                                        type={"name"}
                                        inputWidth={250}
                                        inputHeight={35}
                                        margin={15}
                                        textAlign={"left"}
                                        fontFamily={'Cairo'}
                                        fontWeight={'bolder'}
                                    />
                                </Pane>
                                <Pane display="flex">
                                    <TextInputField
                                        required
                                        label={"Deadline"}
                                        onChange={e => setApplicationDeadline(e.target.value)}
                                        value={applicationDeadline}
                                        placeholder={""}
                                        type={"date"}
                                        inputWidth={250}
                                        inputHeight={35}
                                        margin={15}
                                        textAlign={"left"}
                                        fontFamily={'Cairo'}
                                        fontWeight={'bolder'}
                                    />
                                    <TextInputField
                                        //onChange={e => setPosition(e.target.value)}
                                        label={"Salary"}
                                        //value={salary}
                                        placeholder={"£0 - £50,000"}
                                        type={"integer"}
                                        inputWidth={250}
                                        inputHeight={35}
                                        margin={15}
                                        textAlign={"left"}
                                        fontFamily={'Cairo'}
                                        fontWeight={'bolder'}
                                    />
                                </Pane>

                                <Pane display="flex">
                                    <TextInputField
                                        label={"URL"}
                                        //onChange={e => setApplicationDeadline(e.target.value)}
                                        //value={applicationDeadline}
                                        placeholder={""}
                                        type={"link"}
                                        inputWidth={530}
                                        inputHeight={35}
                                        margin={15}
                                        textAlign={"left"}
                                        fontFamily={'Cairo'}
                                        fontWeight={'bolder'}
                                    />
                                </Pane>

                                <TextareaField
                                    label={"Job Description"}
                                    onChange={e => setJobDescription(e.target.value)}
                                    value={jobDescription}
                                    placeholder={""}
                                    type={"text"}
                                    inputWidth={530}
                                    inputHeight={200}
                                    margin={15}
                                    textAlign={"left"}
                                    fontFamily={'Cairo'}
                                    fontWeight={'bolder'}
                                />

                                <Combobox
                                    openOnFocus
                                    items={['Applied', 'Not Applied']}
                                    onChange={selected => console.log(selected)}
                                    placeholder="Status"
                                    margin={15}
                                />

                                {/*<Pane display={"flex"} justifyContent={"flex-start"}>
                                    <SelectField
                                        inputWidth={200}
                                        inputHeight={35}
                                        margin={15}
                                        textAlign={"left"}
                                        fontFamily={'Cairo'}
                                        fontWeight={'bolder'}
                                        defaultValue={applicationStatus}
                                        label="Application Status"
                                        required
                                        onChange={(option) => {
                                            if (option.target.value === 'true') {
                                                setApplicationStatus(true);
                                                setProgressLevel("Assessment");
                                                setAssessmentCompleted(true);
                                            } else {
                                                setApplicationStatus(false);
                                                setProgressLevel(null);
                                                setAssessmentCompleted(null);
                                                setInterviewFinalCompleted(null);
                                                setInterviewCallCompleted(null);
                                            }
                                        }}
                                    >
                                        <option value="false">Not Applied</option>
                                        <option value="true">Applied</option>
                                    </SelectField>

                                    {applicationStatus ?
                                        <SelectField
                                            inputWidth={200}
                                            inputHeight={35}
                                            margin={15}
                                            textAlign={"left"}
                                            fontFamily={'Cairo'}
                                            fontWeight={'bolder'}
                                            label="Progress Level"
                                            defaultValue={progressLevel}
                                            required
                                            onChange={(option) => {
                                                setProgressLevel(option.target.value);
                                                switch (option.target.value) {
                                                    case "Assessment":
                                                        setAssessmentCompleted(true);
                                                        setInterviewCallCompleted(false);
                                                        setInterviewFinalCompleted(false);
                                                        break;
                                                    case "Interview - Call":
                                                        setAssessmentCompleted(true);
                                                        setInterviewCallCompleted(true);
                                                        setInterviewFinalCompleted(false);
                                                        break;
                                                    case "Interview - Final":
                                                        setAssessmentCompleted(true);
                                                        setInterviewCallCompleted(true);
                                                        setInterviewFinalCompleted(true);
                                                        break;
                                                }
                                            }}
                                        >
                                            <option value="Assessment" selected>Assessment</option>
                                            <option value="Interview - Call">Interview - Call</option>
                                            <option value="Interview - Final">Interview - Final</option>
                                        </SelectField>
                                        :
                                        <TextInputField
                                            required
                                            label={"Application Deadline"}
                                            onChange={e => setApplicationDeadline(e.target.value)}
                                            value={applicationDeadline}
                                            placeholder={""}
                                            type={"date"}
                                            inputWidth={165}
                                            inputHeight={35}
                                            margin={15}
                                            textAlign={"left"}
                                            fontFamily={'Cairo'}
                                            fontWeight={'bolder'}
                                        />
                                    }

                                </Pane>
*/}

                                {/*<TextareaField
                                    label={"Additional Notes"}
                                    onChange={e => setAdditionalNotes(e.target.value)}
                                    value={additionalNotes}
                                    placeholder={""}
                                    type={"text"}
                                    inputWidth={550}
                                    inputHeight={170}
                                    margin={15}
                                    textAlign={"left"}
                                    fontFamily={'Cairo'}
                                    fontWeight={'bolder'}
                                />*/}
                            </Pane>

                        </Card>
                    </Pane>
                }

                {selectedIndex === 1 &&

                    <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
                        <Card
                            background={"#FFFFFF"}
                            border={'0.5px solid #D9D9D9'}
                            boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
                            borderRadius={'8px'}
                            padding={20}
                            elevation={30}
                            height={'100%'}
                        >

                            {editApplication &&
                                applicationDocument.map(document =>
                                    <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
                                        <Pane flex={1} alignItems="center" display="flex">
                                            <Heading size={400}>{document.title}</Heading>
                                            {/*<Button size="large" onClick={()=>window.open(document.file, '_blank')}>{document.title}</Button>*/}
                                        </Pane>
                                        <Pane>
                                            <Button size="medium" iconBefore={DocumentOpenIcon} intent={"success"}
                                                    onClick={() => window.open(document.file, '_blank')}>Open</Button>
                                            <Button size="medium" iconBefore={TrashIcon}
                                                    onClick={() => onClickedDeleteDocument(document.id)}
                                                    intent="danger">Delete</Button>
                                        </Pane>
                                    </Pane>
                                )
                            }
                            <Pane marginTop={20} maxWidth={654}>
                                <FileUploader
                                    //acceptedMimeTypes={acceptedMimeTypes}
                                    label="Upload Documents"
                                    description="You can upload up to 5 files. Files can be up to 5MB. You can upload .pdf file formats."
                                    disabled={files.length + fileRejections.length >= maxFiles}
                                    maxSizeInBytes={maxSizeInBytes}
                                    maxFiles={maxFiles}
                                    onAccepted={setFiles}
                                    onRejected={setFileRejections}
                                    renderFile={(file, index) => {
                                        const {name, size, type} = file
                                        const renderFileCountError = index === 0 && fileCountOverLimit > 0

                                        // We're displaying an <Alert /> component to aggregate files rejected for being over the maxFiles limit,
                                        // so don't show those errors individually on each <FileCard />
                                        const fileRejection = fileRejections.find(
                                            (fileRejection) => fileRejection.file === file && fileRejection.reason !== FileRejectionReason.OverFileLimit
                                        )
                                        const {message} = fileRejection || {}

                                        return (
                                            <React.Fragment key={`${file.name}-${index}`}>
                                                {renderFileCountError &&
                                                    <Alert intent="danger" marginBottom={majorScale(2)}
                                                           title={fileCountError}/>}
                                                <FileCard
                                                    isInvalid={fileRejection != null}
                                                    name={name}
                                                    onRemove={() => handleRemove(file)}
                                                    sizeInBytes={size}
                                                    type={type}
                                                    validationMessage={message}
                                                />
                                            </React.Fragment>
                                        )
                                    }}
                                    values={values}
                                />
                            </Pane>
                        </Card>
                    </Pane>
                }
            </SideSheet>

            {applications !== null &&
                <Table margin={20} borderRadius={20}>
                    <Table.Head  style={{fontFamily: 'Cairo',fontWeight:'bolder', color:'black', fontSize: 12}}>
                        <Table.TextHeaderCell>Company Name</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Position</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Deadline</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Status</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Assessment</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Interview (Call)</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Interview (Final)</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Offer</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Accepted</Table.TextHeaderCell>
                        <Table.TextHeaderCell></Table.TextHeaderCell>
                    </Table.Head>

                    <Table.VirtualBody height={600}>
                        {applications.filter(p => filterTable ? p.status === filterBy : p).map((application) => {
                            const applicationId = application.id;
                            const companyName = application.companyName;
                            const position = application.position;
                            let deadline = application.deadline;
                            let applicationStatus = application.status ? 'Applied' : 'Not Applied';
                            let offer = application.offer;
                            let accepted = application.accepted;
                            const description = application.description;
                            const notes = application.notes;
                            let progress = application.progress;

                            let interviewCall, assessment, interviewFinal;
                            let deadlineColor = 'green';
                            let statusColor = 'blue';
                            let assessmentColor = '#ffffff00';
                            let interviewCallColor = '#ffffff00';
                            let interviewFinalColor = '#ffffff00';
                            let offerColor = '#ffffff00';
                            let acceptedColor = '#ffffff00';


                            const dateToday = new Date();
                            const dateDeadline = new Date(deadline);
                            const difference = dateDeadline.getTime() - dateToday.getTime();
                            const dateDifference = Math.ceil(difference / (1000 * 3600 * 24));

                            if (dateDifference <= 7){
                                deadlineColor = 'red';
                            }else if (dateDifference > 7 && dateDifference <= 14){
                                deadlineColor = 'yellow'
                            }

                            if (application.status) {
                                interviewCall = (application.interviewCall) ? 'Completed' : '';
                                assessment = (application.assessment) ? 'Completed' : '';
                                interviewFinal = (application.interviewFinal) ? 'Completed' : '';
                                deadline = 'Applied';
                                deadlineColor = 'green';
                                statusColor = 'green';

                                if (application.offer === true){
                                    offer = 'Offer Received';
                                    offerColor = 'green';
                                    assessmentColor = 'green';
                                    interviewCallColor = 'green';
                                    interviewFinalColor = 'green';
                                }else if (application.progress === 'Interview - Final') {
                                    interviewFinal = 'In Progress';
                                    interviewFinalColor = 'blue';
                                    interviewCallColor = 'green';
                                    assessmentColor = 'green';
                                } else if (application.progress === 'Interview - Call') {
                                    interviewCall = 'In Progress';
                                    interviewCallColor = 'blue';
                                    assessmentColor = 'green';
                                } else if (application.progress === 'Assessment') {
                                    assessment = 'In Progress'
                                    assessmentColor = 'blue';
                                }

                                if (application.accepted === true){
                                    accepted = 'Accepted';
                                    acceptedColor = 'green';
                                } else if (application.accepted === false && application.offer === true){
                                    accepted = 'Denied';
                                    acceptedColor = 'purple'
                                }else if (application.accepted === false && application.progress === 'Interview - Final'){
                                    accepted = '';
                                    applicationStatus = 'Rejected';
                                    statusColor = 'red';
                                    interviewFinal = 'Rejected';
                                    interviewFinalColor = 'red';
                                }else if (application.accepted === false && application.progress === 'Interview - Call'){
                                    accepted = '';
                                    applicationStatus = 'Rejected';
                                    statusColor = 'red';
                                    interviewCall = 'Rejected';
                                    interviewCallColor = 'red';
                                }else if (application.accepted === false && application.progress === 'Assessment'){
                                    accepted = '';
                                    applicationStatus = 'Rejected';
                                    statusColor = 'red';
                                    assessmentColor = 'red';
                                    assessment = 'Rejected';
                                }
                            }

                            const _onClickApplication = () => {
                                const docs = documents.results.filter(document => document.applicationId === application.id);
                                setApplicationDocuments(docs);
                                setInterviewCallCompleted(application.interviewCall);
                                setAssessmentCompleted(application.assessment);
                                setInterviewFinalCompleted(application.interviewFinal)

                                showApplication(applicationId, companyName, position, deadline, description, notes, application.status, progress);
                            }



                            const updateApplication =() => {
                                onClickedUpdate(
                                    application.id,
                                    application.companyName,
                                    application.position,
                                    application.description,
                                    application.notes,
                                    application.deadline,
                                    application.status,
                                    application.interviewCall,
                                    application.assessment,
                                    application.interviewFinal,
                                    application.progress,
                                    application.offer,
                                    application.accepted
                                ).then(() => console.log('application updated.'));
                            }

                            const _onClickProgress = () => {

                                if (application.offer === true){
                                    application.accepted = true;
                                }else if (application.progress === 'Interview - Final'){
                                    application.offer = true;
                                }else if (application.progress === 'Interview - Call'){
                                    application.interviewFinal = true;
                                    application.progress = 'Interview - Final';
                                }else if (application.progress === 'Assessment'){
                                    application.interviewCall = true;
                                    application.progress = 'Interview - Call';
                                }else if (application.status === false){
                                    application.progress = 'Assessment';
                                    application.assessment = true;
                                    application.status = true;
                                }
                                updateApplication();
                            }

                            const _onClickRejected = () => {
                                application.accepted = false;
                                updateApplication();
                            }

                            return (
                                <Table.Row key={application.id} isSelectable>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'bold', color:'black'}}   onClick={() => {_onClickApplication()}}>{companyName}</Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color:'black'}} onClick={() => {_onClickApplication()}}>{position}</Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {deadlineColor}>{deadline}</Badge></Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {statusColor}>{applicationStatus}</Badge></Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {assessmentColor}>{assessment}</Badge></Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {interviewCallColor}>{interviewCall}</Badge></Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {interviewFinalColor}>{interviewFinal}</Badge></Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {offerColor}>{offer}</Badge></Table.TextCell>
                                    <Table.TextCell textProps={{fontFamily: 'Cairo',fontWeight:'normal', color: 'black'}} onClick={() => {_onClickApplication()}}><Badge color = {acceptedColor}>{accepted}</Badge></Table.TextCell>
                                    <Table.TextCell>
                                        <>
                                            {(accepted === null || applicationStatus === 'Not Applied') &&
                                                <>
                                                    <IconButton icon={TickIcon} intent="success" marginRight={majorScale(2)} onClick={() => _onClickProgress()}/>
                                                    <IconButton icon={CrossIcon} intent="danger" marginRight={majorScale(2)} onClick={() => _onClickRejected()}/>
                                                    {/* <IconButton opacity={application.offer !== true ? 1 : 0.3} icon={DoubleChevronRightIcon} marginRight={majorScale(1)}/>*/}
                                                </>

                                            }
                                        </>

                                    </Table.TextCell>


                                </Table.Row>
                            )

                        })}
                    </Table.VirtualBody>
                </Table>
            }

        </Layout>
    )
}

export default Dashboard;
