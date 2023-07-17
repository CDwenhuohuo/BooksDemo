import  { useEffect, useState,useRef  } from 'react';
// import React from 'react';
import { Space, Table,Button,Modal,Form,Input ,message  } from 'antd';

function App() {
  const [books, setBooks] = useState([]);
  const formRef = useRef(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const url = 'http://hmajax.itheima.net/api/books?creator=小李';
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.data);
      setBooks(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    {
      title: '书名',
      align:"center",
      dataIndex: 'bookname',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '出版社',
      align:"center",
      dataIndex: 'publisher',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '作者',
      align:"center",
      dataIndex: 'author',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },

    {
      title: '操作',
      align:"center",
      dataIndex: 'author',
      key: 'id',
      render: (text,record) =>
      <Space>
      <Button style={{backgroundColor:'red'}}   type="primary" onClick={() => handleDelete(record.id)}>删</Button>
      <Button type="dashed" onClick={() => handleEdit(record.id)}>改</Button>
      <Button type="primary" onClick={() => handleAdd(record.id)}>加</Button>
    </Space>
      ,
    },
  ]
  const [editingBookId, setEditingBookId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 声明表单数据
  const [ setFormData] = useState({});
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
   
    if(editingBookId){
      // console.log(editingBookId);
      const id=editingBookId
      formRef.current.validateFields().then((values) => {
        console.log('Form Data:', values);
       
        fetch(`http://hmajax.itheima.net/api/books/${id}`,{
          method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
     body: JSON.stringify(values)
        }).then(response=>response.json()) .then((data) => {
          console.log(data.message);
          message.success(data.message); // 显示成功提示
          fetchData(); // 重新获取数据并更新页面
        })
        setIsModalOpen(false);
      }).catch((error) => {
        console.error('Error submitting form:', error);
      });
    }else{
      formRef.current.validateFields().then((values) => {
        console.log('Form Data:', values);
        fetch('http://hmajax.itheima.net/api/books',{
          method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
     body: JSON.stringify(values)
        }).then(response=>response.json()) .then((data) => {
          console.log(data.message);
          message.success(data.message); // 显示成功提示
          fetchData(); // 重新获取数据并更新页面
        })
        setIsModalOpen(false);
      }).catch((error) => {
        console.error('Error submitting form:', error);
      });

    }
 

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDelete = (id) => {
    // 处理删除操作
    fetch(`http://hmajax.itheima.net/api/books/${id}`,
    {
      method: 'DELETE',
    })  .then(response => {
      if (response.ok) {
        // 删除成功
        console.log('删除成功');
        message.success('删除成功')
        fetchData()
      } else {
        // 删除失败
        console.error('删除失败');
      }
    })
    console.log('Deleting item with id:', id);
  };

  const handleAdd = () => {
    // 处理添加操作

  setEditingBookId(null); // 重置编辑书籍ID
  formRef.current.setFieldsValue({
    bookname: '',
    author:'',
    publisher:'',
    creator:''
  });
  showModal()
    console.log('Adding new item');
  };

  const handleEdit = (id) => {
    // 处理修改操作
   
    setEditingBookId(id);
  // 发起请求获取书籍数据
  console.log(id);
  fetch(`http://hmajax.itheima.net/api/books/${id}`)
    .then(response => response.json())
    .then(data => {
      // 设置表单数据
      console.log(data.data);
      console.log(data);
      formRef.current.setFieldsValue({
        bookname: data.data.bookname,
        author: data.data.author,
        publisher: data.data.publisher,
        creator: data.data.creator
      });
      // fetchData()
    })
    .catch(error => {
      console.error('Error fetching book data:', error);
    });
    showModal()

    console.log('Editing item with id:', id);
  };
  const data=books

  const App = () => <Table columns={columns} dataSource={data} />;
  // yangs
  return (
   <>
    <div>
      <h1>Books</h1>
      <ul>
        {books.map((el) => (
          <li key={el.id}>{el.bookname} </li>
        ))}
    
      </ul>
    
    </div>
    <div>
      <App></App>
    </div>


    <Modal  title={editingBookId ? '修改图书' : '添加图书'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
  <Form  ref={formRef} onFinish={(values) => setFormData(values)}>
    <Form.Item label="书名" name="bookname">
      <Input />
    </Form.Item>
    <Form.Item label="作者" name="author">
      <Input />
    </Form.Item>
    <Form.Item label="出版社" name="publisher">
      <Input />
    </Form.Item>
    <Form.Item label="创建者" name="creator">
      <Input />
    </Form.Item>
  </Form>
</Modal>

   </>
    
  );
}

export default App;