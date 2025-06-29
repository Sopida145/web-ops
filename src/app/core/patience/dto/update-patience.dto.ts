import { CreatePatienceDto } from "./create-patience.dto";



export interface UpdatePatienceDto extends CreatePatienceDto {
    firstName: string;
    lastName: string;
    hn: string; 
    dob: string;
    idCard: string;
    phone: string;
    Address: string;
    id: string; 
    
    
    
}