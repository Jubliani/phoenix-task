interface SearchFormComponents {
    submitFunc: (e: React.FormEvent) => void;
    setFirst: (e: string) => void;
    setSecond: (e: string) => void;
    firstLabel: string;
    secondLabel: string;
    buttonFunc: (param: boolean) => void;
  }
const SearchForm: React.FC<SearchFormComponents> = ({
    submitFunc, setFirst, setSecond, firstLabel, secondLabel, buttonFunc
}) => {
    return (
        <>
        <form onSubmit={submitFunc} className="flex flex-col gap-3 p-6 bg-white shadow-md rounded-md max-w-lg w-full">
            <label>{firstLabel}</label>
            <input onChange={e => setFirst(e.target.value)} type="text" required className="input-field"/>
            
            <label>{secondLabel}</label>
            <input onChange={e => setSecond(e.target.value)} type="text" required className="input-field"/>
            
            <button type="submit" className="py-2 rounded-md text-white bg-green-600 font-bold w-40 mx-auto transition duration-150 hover:bg-green-500">Search</button>
            <button onClick={() => buttonFunc(false)} className="btn-back w-1/2 mx-auto">Back</button>
        </form>
        </>
    )
}

export default SearchForm;