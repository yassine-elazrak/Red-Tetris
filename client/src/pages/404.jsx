import React from "react"
import { Result, Button, Card } from "antd"

const Page404 = () => {
    return (
        <Card type="inner"
            actions={[
                <Button type='primary'>
                    Back Home </Button>
            ]}
            >
            <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            style={{
                padding: 0,
                margin: 0,
            }}
            />
        </Card>

    )
}

export default Page404
