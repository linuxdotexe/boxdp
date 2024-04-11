type TypeType = "Review" | "Person" | "Movie" | "Organization" | "PublicationEvent" | "aggregateRating" | "Country";

export default interface LetterboxdData {
    film_year?: string,
    datePublished: string,
    "@type": string,
    author: Array<
        {
            "@type": string,
            name: string,
            sameAs: string
        }
    >,
    publisher: {
        "@type": string,
        name: string,
        sameAs: string
    },
    description: string,
    reviewBody: string,
    itemReviewed: {
        image: string,
        dateCreated: string,
        "@type": string,
        director: Array<
            {
                "@type": string,
                name: string,
                sameAs: string
            }
        >,
        name: string,
        sameAs: string
    },
    "@context": string,
    reviewRating: {
        bestRating: number,
        "@type": string,
        ratingValue: number,
        worstRating: number
    },
    url: string
}
