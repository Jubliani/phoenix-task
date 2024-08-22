interface SearchFormComponents {
    submitFunc: (e: React.FormEvent) => void;
    setFirst: (e: string) => void;
    setSecond: (e: string) => void;
    firstLabel: string;
    secondLabel: string;
  }
const SearchForm: React.FC<SearchFormComponents> = ({
    submitFunc, setFirst, setSecond, firstLabel, secondLabel
}) => {
    return (
        <form onSubmit={submitFunc} className="flex flex-col gap-3">
            <label>
                {firstLabel}
            </label>
            <input onChange={e => setFirst(e.target.value)} type="text" required/>
            <label>
                {secondLabel}
            </label>
            <input onChange={e => setSecond(e.target.value)} type="text" required/>
            <button type="submit" className="w-full border border-solid border-black rounded">Search</button>
        </form>
    )
}

export default SearchForm;