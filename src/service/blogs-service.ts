import {CustomSortDirection} from "../routers/util-enums/sort-direction";


const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_DIRECTION = CustomSortDirection.Descending;


export const blogsService = {
    async getAllBlogs(inputBlogsQueryDto: InputBlogsQuery) {}
}