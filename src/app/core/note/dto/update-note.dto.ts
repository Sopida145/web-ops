import { CreateNoteDto } from "./create-note.dto";


export interface UpdateNoteDto extends CreateNoteDto {
    id: string;
    hn: string;
    bloodPressure: string;
    s: string;
    o: string;
    a: string;
    p: string;
}