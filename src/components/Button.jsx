const Button = ({className, onClick, content, value}) => {

    return value ? (
        <button className={className} onClick={onClick} value={value}>
            {content}
        </button>
    ) : (
        <button className={className} onClick={onClick}>
            {content}
        </button>
    )
};

export default Button