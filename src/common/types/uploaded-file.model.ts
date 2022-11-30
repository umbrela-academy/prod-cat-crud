export class UploadedFileModel {
  fieldname: string;
  originalname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer | any;
  size: number;
}
