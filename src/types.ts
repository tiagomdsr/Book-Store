enum BookCategory {
    Romance = "Romance",
    Fantasia = "Fantasia",
    FiccaoCientifica = "Ficção Científica",
    Biografia = "Biografia",
    Historia = "História",
    Tecnologia = "Tecnologia",
    Terror = "Terror",
    Outro = "Outro",
}

type TypeBook = {
    bookId?: number;
    title: string;
    summary: string;
    year: number;
    pages: number;
    isbn: string;
    categoryId: number;
    authorId: number;
    publisherId: number;
}

type TypeAuthor = {
    authorId?: number; 
    name: string;
    email: string;
    phone: string;
    bio: string;
}

type TypePublisher = {
    publisherId?: number;
    name: string;
    address: string;
    phone: string;
}


export { BookCategory, TypeBook, TypeAuthor, TypePublisher };
