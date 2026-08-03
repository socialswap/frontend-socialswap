import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Typography } from 'antd';
import { PlayCircleOutlined, SaveOutlined } from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';

const { Title, Paragraph } = Typography;

const AdminHomeVideo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentVideo, setCurrentVideo] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`${api}/home-video`);
        if (res.data.success) {
          setCurrentVideo(res.data.url);
          form.setFieldsValue({ url: res.data.url });
        }
      } catch (error) {
        console.error('Error fetching home video:', error);
        message.error('Failed to load current home video.');
      } finally {
        setFetching(false);
      }
    };
    fetchVideo();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Basic extraction of video ID to form embed URL if full link is pasted
      let finalUrl = values.url;
      // eslint-disable-next-line no-useless-escape
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = values.url.match(youtubeRegex);
      if (match && match[1]) {
        // Construct embed URL with autoplay parameters
        finalUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`;
      }

      const res = await axiosInstance.put(`${api}/admin/home-video`, { url: finalUrl });
      if (res.data.success) {
        message.success('Home video updated successfully!');
        setCurrentVideo(res.data.url);
        form.setFieldsValue({ url: res.data.url });
      }
    } catch (error) {
      console.error('Error updating home video:', error);
      message.error(error.response?.data?.message || 'Failed to update home video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card
        bordered={false}
        className="shadow-sm border border-border-color bg-bg-card"
        title={
          <div className="flex items-center gap-2">
            <PlayCircleOutlined className="text-purple-primary text-xl" />
            <span className="text-lg font-semibold text-text-primary">Manage Home Page Video</span>
          </div>
        }
      >
        {fetching ? (
          <div className="flex justify-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Title level={5} className="text-text-primary mb-4">
                Update Video Link
              </Title>
              <Paragraph className="text-text-secondary mb-6">
                Paste any YouTube video link here. It will automatically be converted to a muted, autoplaying background video format for the Home page.
              </Paragraph>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  name="url"
                  label={<span className="text-text-primary font-medium">YouTube Video URL</span>}
                  rules={[
                    { required: true, message: 'Please enter a YouTube URL' },
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                >
                  <Input 
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    size="large"
                    className="bg-bg-secondary border-border-color text-text-primary"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                    className="bg-purple-primary border-none w-full md:w-auto"
                  >
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className="flex-1">
              <Title level={5} className="text-text-primary mb-4">
                Current Video Preview
              </Title>
              {currentVideo ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border-color">
                  <iframe
                    className="w-full h-full"
                    src={currentVideo}
                    title="Current Home Video Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-xl bg-bg-secondary border border-dashed border-border-color flex items-center justify-center">
                  <span className="text-text-secondary">No video set</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminHomeVideo;
