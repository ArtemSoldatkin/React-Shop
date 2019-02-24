import React, { PureComponent } from "react";
import { Icon, Spin, Modal } from "antd";
import "./catalog.less";

interface Image {
  url: string | undefined;
  loading: boolean;
}

export type Images = string[];

interface CmpProps {
  images: string[];
  onChange: (images: Images, newImages?: Images) => void;
}

interface CmpStates {
  images: Image[];
  loading: boolean;
  visible: boolean;
  selectedImage: string | undefined;
}

class CustomUpload extends PureComponent<CmpProps, CmpStates> {
  constructor(props: CmpProps) {
    super(props);
    this.state = {
      images: [],
      loading: false,
      visible: false,
      selectedImage: undefined
    };
  }
  isUnmounted = false;
  async componentDidMount() {
    if (this.props.images) await this.setState({ images: this.createImages() });
  }
  componentDidUpdate(prevProps: CmpProps) {
    if (this.props.images !== prevProps.images && this.props.images) {
      const images = this.createImages();
      if (images !== this.state.images)
        this.setState({ images: this.createImages() });
    }
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  private createImages = (): Image[] =>
    this.props.images.map((image, index) => {
      return { url: image, loading: false };
    });
  private returnChanges = (newImages?: Image[]): void => {
    const imageToImages = (images: Image[]): Images =>
      images
        .map(image => image.url)
        .filter(image => image !== undefined) as string[];

    let newImgs = undefined;
    if (newImages) newImgs = imageToImages(newImages);
    this.props.onChange(imageToImages(this.state.images), newImgs);
  };
  private imageToUrl = async (file: File, images: Image[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result;
        if (typeof image === "string" || image === undefined)
          images.push({ url: image, loading: false });
        resolve();
      };
      reader.onerror = () => {
        reader.abort();
        images.push({ url: undefined, loading: false });
        reject();
      };
      reader.readAsDataURL(file);
    });
  };
  private handleChange = async (fileList: FileList | null): Promise<void> => {
    try {
      if (!(fileList instanceof FileList)) return;
      this.setState({ loading: true });
      let images: Image[] = [];
      const { images: tempImages } = this.state;
      for (let index in fileList) {
        const file = fileList[index];
        if (file instanceof File)
          images.push({ url: undefined, loading: true });
      }
      await this.setState({ images: [...images, ...tempImages] });
      images = [];
      for (let index in fileList) {
        const file = fileList[index];
        if (file instanceof File) await this.imageToUrl(file, images);
      }
      await setTimeout(async () => {
        await this.setState({
          images: [...images, ...tempImages],
          loading: false
        });
        this.returnChanges(images);
      }, 900);
    } catch (err) {
      return;
    }
  };
  private handlePreview = (image: string | undefined): void => {
    if (!image) return;
    return this.setState({ selectedImage: image, visible: true });
  };
  private handleRemove = (url: string | undefined): void => {
    let { images } = this.state;
    const index = images.findIndex(image => image.url === url);
    if (typeof index !== "number") return;
    const changes = images.splice(index, 1);
    return this.setState({ images }, () => this.returnChanges(changes));
  };
  private handleCancel = (): void => {
    this.setState({ visible: false });
  };
  render() {
    const { images, selectedImage, visible, loading } = this.state;
    const imageList = images.map((image, index) => {
      return (
        <div className="custom-upload__box" key={`${Date.now()}${index}`}>
          <Spin spinning={image.loading}>
            <div className="custom-upload__box__bx">
              <img className="custom-upload__box__bx__image" src={image.url} />
            </div>
            <div className=" custom-upload__box__actions">
              <div>
                <span
                  className=" custom-upload__box__actions__btn"
                  onClick={() => this.handlePreview(image.url)}
                >
                  <Icon type="eye" />
                </span>
                <span
                  className=" custom-upload__box__actions__btn"
                  onClick={() => this.handleRemove(image.url)}
                >
                  <Icon type="delete" />
                </span>
              </div>
            </div>
          </Spin>
        </div>
      );
    });
    return (
      <div className="custom-upload">
        <div className="custom-upload__upload">
          <div className="custom-upload__upload__replacement">
            <div>
              <Icon type="plus" />
              <p>Загрузить</p>
            </div>
          </div>
          <input
            type="file"
            disabled={loading}
            draggable
            multiple
            className="custom-upload__upload__input"
            onChange={e => this.handleChange(e.target.files)}
          />
          />
        </div>
        {imageList}
        <Modal
          title={null}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          closable={false}
          bodyStyle={{ padding: "5px" }}
        >
          <div className=" custom-upload__modal">
            <img
              className=" custom-upload__box__bx__image"
              src={selectedImage}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomUpload;
