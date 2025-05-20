import { Component, createRef } from "react";
import { Link, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getPage, getPageServices, updatePageService, removePageService, getServices, addPageService } from "../api";

import "./page.scss";

class Page extends Component {

    constructor(props) {

        super(props);

        this.displayNameInputRef = createRef();

        this.state = { loading: false, info: null, page: null, pageServices: null, editService: null, addService: false, services: null };
    }

    componentDidMount() {

        this.setState({ loading: true });
        Promise.all([
            getPage(this.props.params.pageId, ["subPages", "subPages.subPage"])
                .then((page) => this.setState({ page }))
                .catch((error) => this.setState({ info: error })),
            getPageServices(this.props.params.pageId, ["service"])
                .then((pageServices) => this.setState({ pageServices }))
                .catch((error) => this.setState({ info: error }))
        ]).then(() => this.setState({ loading: false }));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.pageId !== this.props.params.pageId) this.componentDidMount();
    }

    render() {

        const dragEndHandler = (result) => {

            if (!result.destination) return;

            this.setState({ loading: true, info: null });
            updatePageService(this.state.page.id, result.draggableId, { position: result.destination.index + 1 }).then(() => {
                getPageServices(this.props.params.pageId, ["service"])
                    .then((pageServices) => this.setState({ loading: false, pageServices }))
                    .catch((error) => this.setState({ loading: false, info: error }));
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const toggleEditService = (pageService) => {

            if (this.state.editService !== pageService.service.id) {
                this.setState({ editService: pageService.service.id });
                return;
            }

            const displayName = this.displayNameInputRef.current.value.trim() || null;

            if (displayName === pageService.displayName) {
                this.setState({ editService: null });
                return;
            }

            this.setState({ loading: true, info: null });
            updatePageService(this.state.page.id, pageService.service.id, { displayName }).then(() => {
                this.setState({
                    loading: false, editService: null,
                    pageServices: this.state.pageServices.map((service) => service.service.id === pageService.service.id ? { ...service, displayName: displayName } : service)
                });
            }).catch((error) => {
                this.setState({ loading: false, info: error }, () => {
                    if (error === "Display name must be between 2 and 50 characters") this.displayNameInputRef.current.focus();
                });
            });
        };

        const toggleAddServices = () => {

            if (this.state.addService) {
                this.setState({ addService: !this.state.addService, services: null });
                return;
            }

            this.setState({ loading: true, info: null });
            getServices()
                .then((services) => this.setState({ loading: false, addService: true, services }))
                .catch((error) => this.setState({ loading: false, info: error }));
        };

        const addServiceHandler = (service) => {
            this.setState({ loading: true, info: null });
            addPageService(this.state.page.id, service.id).then(() => {
                this.setState({
                    loading: false,
                    pageServices: this.state.pageServices.concat({ page: this.state.page.id, service, position: this.state.pageServices.length + 1, displayName: null }).sort((a, b) => a.service.id - b.service.id)
                });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const removeServiceHandler = (pageService) => {
            this.setState({ loading: true, info: null });
            removePageService(this.state.page.id, pageService.service.id).then(() => {
                this.setState({
                    loading: false,
                    pageServices: this.state.pageServices.filter((service) => service.service.id !== pageService.service.id).map((service) => ({ ...service, position: service.position > pageService.position ? service.position - 1 : service.position }))
                });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const nonAddedServices = this.state.services?.filter((service) => !this.state.pageServices?.some((pageService) => pageService.service.id === service.id));

        return <div className="page-page">

            <div className="title">Page</div>

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            <div>Short name: {this.state.page?.shortName}</div>
            <div>Title: {this.state.page?.title}</div>
            <div>URL: <a href={this.state.page?.url} target="_blank" rel="noreferrer">{this.state.page?.url}</a></div>
            <div>Logo URL: <a href={this.state.page?.logoUrl} target="_blank" rel="noreferrer">{this.state.page?.logoUrl}</a></div>
            <div>Domain: {this.state.page?.domain ? <a href={"https://" + this.state.page.domain} target="_blank" rel="noreferrer">{this.state.page.domain}</a> : "N/A"}</div>
            <br />

            <div>Sub pages:</div>
            {!!this.state.page?.subPages.length && <table>
                <thead>
                    <tr>
                        <th>Service</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.page.subPages.map((subPage) => <tr key={subPage.subPage.id}>
                        <td><Link to={"/pages/" + subPage.subPage.id}>{subPage.subPage.title}</Link></td>
                    </tr>)}
                </tbody>
            </table>}
            {!this.state.page?.subPages.length && <div>No sub pages yet</div>}
            <br />

            <div>Services:</div>
            {!!this.state.pageServices?.length && <table>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Type</th>
                        <th>Display name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <DragDropContext onDragEnd={dragEndHandler}>
                    <Droppable droppableId="droppable">{(provided) => <tbody {...provided.droppableProps} ref={provided.innerRef}>
                        {this.state.pageServices?.sort((a, b) => a.position - b.position).map((service, index) =>
                            <Draggable key={service.service.id} isDragDisabled={this.state.loading} draggableId={service.service.id.toString()} index={index}>{(provided, snapshot) =>
                                <tr ref={provided.innerRef} {...provided.draggableProps} className={snapshot.isDragging ? "dragging" : ""}>
                                    <td><Link to={"/services/" + service.service.id}>{service.service.name}</Link></td>
                                    <td>{{ website: "Website", api: "API", gateway: "Gateway", minecraft: "Minecraft", server: "Server" }[service.service.type]}</td>
                                    <td>{this.state.editService !== service.service.id ? service.displayName ?? "N/A"
                                        : <input ref={this.displayNameInputRef} defaultValue={service.displayName ?? ""} disabled={this.state.loading} autoFocus
                                            onKeyDown={(event) => event.key === "Enter" && toggleEditService(service)} />}</td>
                                    <td className="actions">
                                        <div {...provided.dragHandleProps}>Move</div>
                                        <button disabled={this.state.loading} onClick={() => toggleEditService(service)}>Edit</button>
                                        <button disabled={this.state.loading} onClick={() => removeServiceHandler(service)}>Remove</button>
                                    </td>
                                </tr>
                            }</Draggable>
                        )}
                        {provided.placeholder}
                    </tbody>}</Droppable>
                </DragDropContext>
            </table>}
            {!this.state.pageServices?.length && <div>No services yet</div>}

            <button disabled={this.state.loading} onClick={toggleAddServices}>Add services</button>
            {this.state.addService && <>
                <div>Non added services:</div>
                {!!nonAddedServices?.length && <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nonAddedServices?.map((service) => <tr key={service.id}>
                            <td><Link to={"/services/" + service.id}>{service.name}</Link></td>
                            <td>{{ website: "Website", api: "API", gateway: "Gateway", minecraft: "Minecraft", server: "Server" }[service.type]}</td>
                            <td><button disabled={this.state.loading} onClick={() => addServiceHandler(service)}>Add</button></td>
                        </tr>)}
                    </tbody>
                </table>}
                {!nonAddedServices?.length && <div>No services not added</div>}
            </>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Page {...props} params={useParams()} />;
