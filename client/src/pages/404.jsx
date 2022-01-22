import React from "react"
import { Result, Button, Card, Layout } from "antd"
import FooterComponet from "../components/Footer"

const { Content, Footer } = Layout

const Page404 = () => {
    return (
        <Layout style={{background: 'none'}}>
            <Layout style={{background: 'none'}}>
              <Content style={{
                  margin: '24px 16px',
                  padding: 24,
                  height: 'calc(100vh - 100px)'
              }}>
                  <Card type="inner"
                        actions={[
                            <Button type='primary'>
                                Back Home
                            </Button>
                        ]}
                        >
                  <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                  />
                  </Card>
              </Content>
            </Layout>
            <Footer style={{
                background: 'none',
                zIndex: '999',
                padding: 0,
            }}>
                <FooterComponet />
            </Footer>
        </Layout>

    )
}

export default Page404
