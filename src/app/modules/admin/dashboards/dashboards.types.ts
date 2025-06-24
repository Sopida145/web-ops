export interface Dashboard
{
    id: string;
    firstname: string;
}

export interface DashboardPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}