export class DownloadedFileModel {
  destination: string;
  originalname: string;
  filename: string;
  mimetype: string;
  url: string | null;
}

export type Image = {
  destination: string;
  originalname: string;
  filename: string;
  mimetype: string;
  url: string;
};
