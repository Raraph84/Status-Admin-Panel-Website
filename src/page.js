import { Component } from "react";
import { Link, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getPage, getPageServices, updatePageService, removePageService, getServices, addPageService } from "./api";

import "./styles/page.scss";

class Page extends Component {

    constructor(props) {

        super(props);

        this.state = { loading: false, info: null, page: null, pageServices: null, addService: false, services: null };
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

    render() {

        const onDragEnd = (result) => {

            if (!result.destination) return;

            this.setState({ loading: true, info: null });
            updatePageService(this.state.page.id, result.draggableId, { position: result.destination.index + 1 }).then(() => {
                getPageServices(this.props.params.pageId, ["service"])
                    .then((pageServices) => this.setState({ loading: false, pageServices }))
                    .catch((error) => this.setState({ loading: false, info: error }));
            }).catch((error) => this.setState({ loading: false, info: error }));
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

        const processAddPageService = (service) => {
            this.setState({ loading: true, info: null });
            addPageService(this.state.page.id, service.id).then(() => {
                this.setState({
                    loading: false,
                    pageServices: this.state.pageServices.concat({ page: this.state.page.id, service, position: this.state.pageServices.length + 1, displayName: null }).sort((a, b) => a.service.id - b.service.id)
                });
            }).catch((error) => this.setState({ loading: false, info: error }));
        };

        const processRemovePageService = (pageService) => {
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

            {this.state.loading && <div className="state">Loading...</div>}
            {this.state.info && <div className="state">{this.state.info}</div>}

            {this.state.page && <>

                <div>Short name: {this.state.page.shortName}</div>
                <div>Title: {this.state.page.title}</div>
                <div>URL: <a href={this.state.page.url} target="_blank" rel="noreferrer">{this.state.page.url}</a></div>
                <div>Logo URL: <a href={this.state.page.logoUrl} target="_blank" rel="noreferrer">{this.state.page.logoUrl}</a></div>
                <div>Domain: {this.state.page.domain ? <a href={"https://" + this.state.page.domain} target="_blank" rel="noreferrer">{this.state.page.domain}</a> : "N/A"}</div>
                <br />

                <div>Sub pages:</div>
                {this.state.page.subPages.map((subPage) => <div key={subPage.subPage.id}>- {subPage.subPage.title}</div>)}
                {!this.state.page.subPages.length && <div>No sub pages yet</div>}
                <br />

                <div>Services:</div>
                {!!this.state.pageServices?.length && <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Display name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">{(provided) => <tbody {...provided.droppableProps} ref={provided.innerRef}>
                            {this.state.pageServices?.sort((a, b) => a.position - b.position).map((service, index) =>
                                <Draggable key={service.service.id} draggableId={service.service.id.toString()} index={index}>{(provided, snapshot) =>
                                    <tr ref={provided.innerRef} {...provided.draggableProps} className={snapshot.isDragging ? "dragging" : ""}>
                                        <td><Link to={"/services/" + service.service.id}>{service.service.name}</Link></td>
                                        <td>{service.displayName ?? "N/A"}</td>
                                        <td className="actions">
                                            <div {...provided.dragHandleProps}>Move</div>
                                            <button disabled={this.state.loading} onClick={() => processRemovePageService(service)}>Remove</button>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nonAddedServices?.map((service) => <tr>
                                <td><Link to={"/services/" + service.id}>{service.name}</Link></td>
                                <td><button disabled={this.state.loading} onClick={() => processAddPageService(service)}>Add</button></td>
                            </tr>)}
                        </tbody>
                    </table>}
                    <div>{!nonAddedServices?.length && <div>No services not added</div>}</div>
                </>}

            </>}

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Page {...props} params={useParams()} />;
