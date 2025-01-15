import { ObjectId } from "mongodb";

export enum RequestStatus {
	PENDING = "pending",
	APPROVED = "approved",
	COMPLETED = "completed",
	REJECTED = "rejected",
}

export interface ItemRequest {
	_id: ObjectId;
	requestorName: string;
	itemRequested: string;
	requestCreatedDate: Date;
	lastEditedDate: Date | null;
	status: RequestStatus;
}

export interface CreateItemRequest {
	requestorName: string;
	itemRequested: string;
}

export interface EditStatusRequest {
	id: string;
	status: RequestStatus;
}
