import { ItemRequest } from "@/lib/types/request";

export function sortItemRequests(requests: ItemRequest[]): ItemRequest[] {
	return requests.sort(
		(a, b) => b.requestCreatedDate.getTime() - a.requestCreatedDate.getTime()
	);
}
