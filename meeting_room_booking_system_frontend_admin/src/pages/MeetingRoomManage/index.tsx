import {
  Badge,
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import "./index.css";
import {
  deleteMeetingRoom,
  meetingRoomList,
} from "../../interfaces/interfaces";
import { CreateMeetingRoomModal } from "./CreateMeetingRoomModal";
import { UpdateMeetingRoomModal } from "./UpdateMeetingRoom";

interface SearchMeetingRoom {
  name: string;
  capacity: number;
  equipment: string;
  location: string;
}

interface MeetingRoomSearchResult {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}

export function MeetingRoomManage() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [meetingRoomResult, setMeetingRoomResult] = useState<
    Array<MeetingRoomSearchResult>
  >([]);
  const [num, setNum] = useState<number>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number>();

  const columns: ColumnsType<MeetingRoomSearchResult> = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "容纳人数",
        dataIndex: "capacity",
      },
      {
        title: "位置",
        dataIndex: "location",
      },
      {
        title: "设备",
        dataIndex: "equipment",
      },
      {
        title: "描述",
        dataIndex: "description",
      },
      {
        title: "添加时间",
        dataIndex: "createTime",
      },
      {
        title: "上次更新时间",
        dataIndex: "updateTime",
      },
      {
        title: "预定状态",
        dataIndex: "isBooked",
        render: (_, record) =>
          record.isBooked ? (
            <Badge status="error">已被预订</Badge>
          ) : (
            <Badge status="success">可预定</Badge>
          ),
      },
      {
        title: "操作",
        render: (_, record) => (
          <>
            <Space>
              <Popconfirm
                title="会议室删除"
                description="确认删除吗？"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <a href="#">删除</a>
              </Popconfirm>
              <a
                href="#"
                onClick={() => {
                  setIsUpdateModalOpen(true);
                  setUpdateId(record.id);
                }}
              >
                更新
              </a>
            </Space>
          </>
        ),
      },
    ],
    []
  );

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteMeetingRoom(id);
      setNum(Math.random());
      message.success("删除成功");
    } catch (e) {
      console.log(e);
      message.error("删除失败");
    }
  }, []);

  const searchMeetingRoom = useCallback(async (values: SearchMeetingRoom) => {
    console.log(values);
    const res = await meetingRoomList(
      values.name,
      values.capacity,
      values.location,
      values.equipment,
      pageNo,
      pageSize
    );

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setMeetingRoomResult(
        data.meetingRooms.map((item: MeetingRoomSearchResult) => {
          return {
            key: item.id,
            ...item,
          };
        })
      );
    } else {
      message.error(data || "系统繁忙，请稍后再试");
    }
  }, []);

  const [form] = useForm();

  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    searchMeetingRoom({
      name: form.getFieldValue("name"),
      capacity: form.getFieldValue("capacity"),
      equipment: form.getFieldValue("equipment"),
      location: form.getFieldValue("location"),
    });
  }, [pageNo, pageSize, num]);

  return (
    <div id="meetingRoomManage-container">
      <div className="meetingRoomManage-form">
        <Form
          form={form}
          onFinish={searchMeetingRoom}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="会议室名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="容纳人数" name="capacity">
            <Input />
          </Form.Item>

          <Form.Item label="位置" name="location">
            <Input />
          </Form.Item>

          <Form.Item label="设备" name="equipment">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Space>
              <Button type="primary" htmlType="submit">
                搜索会议室
              </Button>
              <Button
                type="primary"
                style={{ background: "green" }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                添加会议室
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div className="meetingRoomManage-table">
        <Table
          columns={columns}
          dataSource={meetingRoomResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
          }}
        />
      </div>
      <CreateMeetingRoomModal
        isOpen={isCreateModalOpen}
        handleClose={() => {
          setIsCreateModalOpen(false);
          setNum(Math.random());
        }}
      />
      <UpdateMeetingRoomModal
        id={updateId!}
        isOpen={isUpdateModalOpen}
        handleClose={() => {
          setIsUpdateModalOpen(false);
          setNum(Math.random());
        }}
      ></UpdateMeetingRoomModal>
    </div>
  );
}
