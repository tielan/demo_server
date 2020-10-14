//APP 的入口
class App extends React.Component {
    constructor(props) {
        super(props)
        console.log(window.files)
        this.state = {
            files: window.files,
            index: 0,
        }
    }
    onImgClick = () => {
        const { index,files } = this.state;
        this.setState({
            index: files.length <= index + 1 ? 0 : index + 1
        })
    }
    render() {
        const { files, index } = this.state;
        if (!files || files.length == 0) {
            return <span>{"改项目为空"}</span>;
        }
        const imgUrl = "./img/" + files[index];
        console.log(imgUrl)
        return (
            <div className="conTent" >
                <img src={imgUrl} onClick={this.onImgClick} />
            </div>
        );
    }
}
// ========================================
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
