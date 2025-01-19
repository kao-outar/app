interface MediaFormat {
  url: string;
  name: string;
  width: number;
  height: number;
}

interface Media {
  id: number;
  url: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: {
      url: string;
    };
    small?: {
      url: string;
    };
    medium?: {
      url: string;
    };
    large?: {
      url: string;
    };
  };
}

interface RichTextContent {
  type: string;
  children: {
    type: string;
    text: string;
  }[];
}

export interface Armee {
  id: number;
  nom: string;
  description: RichTextContent[];
  image?: Media;
}

export interface Hero {
  id: number;
  nom: string;
  titre: string;
  description: RichTextContent[];
  image?: Media;
  armee: {
    data: {
      id: number;
      attributes: Armee;
    };
  };
}

export interface Unite {
  id: number;
  nom: string;
  type: string;
  roles: string;
  equipement: string;
  image?: Media;
  armee: {
    data: {
      id: number;
      attributes: Armee;
    };
  };
}
