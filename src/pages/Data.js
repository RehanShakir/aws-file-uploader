import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
// import history from "../utils/CreateBrowserHistory";

import api from "../api/api";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  message,
  Space,
  Upload,
  Modal,
  Form,
} from "antd";

import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";

const Data = () => {
  const componentMounted = useRef(true);
  const [data, setData] = useState([]);
  const [uploadList, setUploadList] = useState(true);
  const [dta, setDta] = useState(null);

  // let intervalId = null;

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };
  const filesData = async () => {
    // if (localStorage.getItem("user-info")) {
    //   history.push("/data");
    // } else {
    //   history.push("/sign-in");
    // }
    const fetch = await api.get("/api/file");

    console.log(fetch);
    if (fetch.status === 200) {
      setData(fetch.data);
    }
  };
  useEffect(() => {
    filesData();
    return () => {
      componentMounted.current = false;
    };
  }, []);
  useEffect(() => {}, [data]);
  useInterval(() => {
    // Make the request here
    filesData();
  }, 1000 * 60);

  const hanldeDownload = (value, record) => {
    console.log(record);
    api
      .get(`/api/file/download/${record.key}`)
      .then((res) => {
        console.log(res.data);
        const win = window.open(res.data, "_blank");
        win.focus();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const columns = [
    {
      title: "Filename",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Action",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value, record) => (
        <Space size="middle">
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => hanldeDownload(value, record)}
            type="primary"
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];
  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = () => {
    const hide = message.loading("Uploading...", 0);

    let formData = new FormData();
    formData.append("Documents", dta);
    api
      .post("/api/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        // Dismiss manually and asynchronously
        setTimeout(hide, 0);

        setIsModalVisible(false);

        message.success("File Uploaded");
        filesData();
      })
      .catch((err) => {
        setTimeout(hide, 0);

        message.error("Upload Failed, Please Check your Internet connection");

        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const beforeUpload = (file) => {
    console.log(file);
    setDta(file);

    return false;
  };
  return (
    <>
      <div className="flex-container" style={{ marginBottom: "10px" }}>
        <Button
          type="primary"
          className="addDevicebtn"
          onClick={showModal}
          style={{
            marginLeft: "10px",
            borderRadius: "50px",
          }}
        >
          Upload File
        </Button>
        <Modal
          title="Upload File"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose={true}
          footer={null}
        >
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            className="row-col"
          >
            <Form.Item name="Photo">
              <Upload beforeUpload={beforeUpload} showUploadList={uploadList}>
                <Button
                  style={{
                    marginTop: "10px",
                    marginLeft: "20px",
                    borderRadius: "50px",
                    align: "center",
                  }}
                  icon={<UploadOutlined />}
                  type="primary"
                >
                  Upload File
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Click to Upload !
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Smart Electric Frequency Monitor"
            >
              <div className="table-responsive">
                <Table
                  key="enCol"
                  columns={columns}
                  dataSource={data}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Data;
