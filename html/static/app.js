//APP 的入口
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            listApp: []
        }
    }

    componentDidMount() {
        this.listApp();
    }
    listApp() {
        this.setState({ loading: true })
        fetch('/message/list')
            .then(response => response.json())
            .catch(error => {
                this.setState({ loading: false })
                alert("获取列表失败" + JSON.stringify(error))
            })
            .then(response => {
                this.setState({ loading: false })
                this.setState({ listApp: response.data })
            });
    }
    delAction = (name) => {
        var r = confirm("确认永久删除【" + name + "】?");
        if (r == true) {
            this.setState({ loading: true })
            fetch('/message/del?name=' + name)
                .then(response => response.json())
                .catch(error => {
                    this.setState({ loading: false })
                    alert("删除失败" + JSON.stringify(error))
                })
                .then(response => {
                    this.listApp();
                });
        }
    }
    onGetFile = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file.type == 'application/x-zip-compressed') {
            this.setState({ loading: true })
            var formData = new FormData();
            formData.append('file', file);
            fetch('/message/upload', {
                method: 'post',
                body: formData
            })
                .then(response => response.json())
                .catch(error => {
                    this.setState({ loading: false })
                    alert("上传失败" + JSON.stringify(error))
                })
                .then(response => {
                    this.listApp();
                });
        } else {
            alert("只能上传zip 格式文件")
        }
    };
    renderItem(item, index) {
        return <div key={index} className="item">
            <div className="item_url">
                <span>{index + 1 + '、'}</span>
                <a href={`/app/${item.name}`} target="_blank">{item.name}</a>
            </div>
            <button onClick={() => {
                this.delAction(item.name)
            }}>{'删除'}</button>
        </div>
    }
    render() {
        const { listApp, loading } = this.state;
        return (
            <div className="app">
                <div className="file">
                    <span>{'添加系统'}</span>
                    <input type="file" onChange={this.onGetFile} />
                </div>
                {
                    listApp.map((item, index) => this.renderItem(item, index))
                }
                { loading ? <div className="loading">
                    <div className="loading_view">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div></div> : null}
                <div>
            <span>{`备注：本系统未演示demo系统，上传 图片zip 按图片顺序点击播放，图片文件名不能有中文，压缩包不能包含文件夹`}</span>
                </div>
            </div>
        );
    }
}
// ========================================
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
