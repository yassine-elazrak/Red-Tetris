import React from "react"
import { Result, Button, Card } from "antd"
import { Link } from 'react-router-dom'

const Page404 = () => {
    return (
        <Card type="inner"
            actions={[
                <Link to='/'>
                    <Button type='primary'>
                        Back Home </Button>
                </Link>
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
