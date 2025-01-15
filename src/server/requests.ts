/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import { ObjectId } from "mongodb";
import client from "@/lib/mongodb";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import {
	EditStatusRequest,
	ItemRequest,
	RequestStatus,
} from "@/lib/types/request";
import { sortItemRequests } from "@/lib/utils/requests";
import paginate from "@/lib/utils/pagination";
import {
	isValidStatus,
	validateCreateItemRequest,
	validateEditStatusRequest,
} from "@/lib/validation/requests";

export async function getItemRequests(
	status: string | null,
	page: number
): Promise<ItemRequest[]> {
	try {
		await client.connect();
		const db = client.db("crisis_compass");
		const collection = db.collection("item_requests");
		const findResult = await collection.find({});
		const itemRequests = await findResult.toArray();
		const sortedRequests = sortItemRequests(itemRequests);
		let filteredRequests = sortedRequests;
		if (status && isValidStatus(status)) {
			filteredRequests = filteredRequests.filter(
				(req) => req.status === status
			);
		}
		const paginatedRequests = paginate(
			filteredRequests,
			page,
			PAGINATION_PAGE_SIZE
		).data;
		console.log(paginatedRequests);
		return paginatedRequests;
	} finally {
		await client.close();
	}
}

export async function createNewRequest(request: any): Promise<ItemRequest> {
	try {
		await client.connect();
		const validatedRequest = validateCreateItemRequest(request);
		if (!validatedRequest) {
			throw new InvalidInputError("created item request");
		}
		const date = new Date();
		const db = client.db("crisis_compass");
		const collection = db.collection("item_requests");
		const newRequest: ItemRequest = {
			_id: new ObjectId(),
			requestorName: validatedRequest.requestorName,
			itemRequested: validatedRequest.itemRequested,
			requestCreatedDate: date,
			lastEditedDate: date,
			status: RequestStatus.PENDING,
		};
		const insertResult = await collection.insertOne(newRequest);
		return newRequest;
	} finally {
		await client.close();
	}
}

export async function editStatusRequest(
	request: any
): Promise<EditStatusRequest> {
	try {
		await client.connect();
		const validatedRequest = validateEditStatusRequest(request);
		if (!validatedRequest) {
			throw new InvalidInputError("edit item request");
		}
		const date = new Date();
		const db = client.db("crisis_compass");
		const collection = db.collection("item_requests");
		const editedItemRequest = await collection.findOne({
			_id: new ObjectId(validatedRequest.id),
		});
		if (!editedItemRequest) {
			throw new InvalidInputError("edit item ID");
		}
		const updateResult = await collection.updateOne(
			{ _id: new ObjectId(validatedRequest.id) },
			{
				$set: {
					lastEditedDate: date,
					status: validatedRequest.status,
				},
			}
		);
		return validatedRequest;
	} finally {
		await client.close();
	}
}
