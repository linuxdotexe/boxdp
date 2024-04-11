export default function Footer() {
    return (
        <footer>
            <div className="w-full bg-gradient-to-r from-orange-600 via-green-600 to-sky-600">
                <div className="flex flex-row justify-around items-center z-10">
                    <a href="https://www.themoviedb.org/"><p className="px-10 bg-gradient-to-r from-transparent via-orange-900 to-transparent">TMDB</p></a>
                    <a href="https://boxdp.vercel.app/"><p className="px-10 bg-gradient-to-r from-transparent via-green-900 to-transparent">boxd-pics</p></a>
                    <a href="https://letterboxd.com/"><p className="px-10 bg-gradient-to-r from-transparent via-sky-900 to-transparent">Letterboxd</p></a>
                </div>
            </div>
        </footer>
    );
};