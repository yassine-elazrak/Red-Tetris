import React from "react";
import { Layout } from "antd";


import { ContentStyled } from "./styles/ContentStyled";

const { Content } = Layout;

const ContentComponent = () => {
    return (
        <ContentStyled>
            <Content style={{ padding: "0 50px", minHeight: "calc(100vh - 100px)"}}>
                {/* <div style={{ border: 1, padding: 24, minHeight: 280 }}>Content</div> */}
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni iusto nam fugit quia quae a unde nesciunt delectus laudantium tempora. Dolores quam quas non in, quis possimus ipsum qui ipsam!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse voluptatum corrupti libero culpa iste fugit debitis molestiae eligendi ad accusantium, fuga repudiandae cumque, cum ea error. Reiciendis facilis et aliquid.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias odio, voluptatem laborum adipisci saepe sit dolores eius labore error a fugiat laudantium ut temporibus. Nobis, iure voluptatum. Porro, iste veritatis!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla placeat totam beatae, quam architecto eaque enim temporibus mollitia ratione incidunt fugit reiciendis, odio esse libero quaerat iusto molestiae quibusdam aperiam?
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic, assumenda. Voluptas, magni ad? Enim blanditiis veritatis similique expedita iusto vero fugiat accusamus adipisci mollitia. Aspernatur recusandae explicabo illo quo sed!
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad commodi aspernatur, placeat et magnam esse a fugit libero molestias facere eos alias doloremque ex veniam assumenda quia accusantium! Facilis, quaerat.
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non autem eaque provident maiores amet laborum cum ea ipsum praesentium adipisci beatae id dolor, enim repellendus quasi mollitia rem eos impedit!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quaerat voluptas, sequi blanditiis, eligendi repudiandae velit eum quasi id quibusdam amet a nemo aut eaque ducimus dolorum at soluta quod!
                </p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis doloremque obcaecati sit delectus ipsa at odio recusandae ut? Minima nam facere corporis placeat delectus asperiores tenetur dolores eum vel magnam!
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, eius qui autem esse sunt blanditiis velit deserunt rerum est ad aliquam maiores earum unde expedita voluptatibus similique eveniet harum ex!
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste voluptas excepturi repellat reiciendis esse cumque, ab asperiores deserunt officiis quae. Enim iste sequi magnam dolore. Possimus nisi ducimus provident qui!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero saepe iste tenetur dolorum praesentium quis officiis laudantium adipisci corrupti eligendi at facere odit itaque, nobis autem soluta provident, consequatur veniam.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione vitae blanditiis vel, neque atque eaque error quaerat excepturi in dolor alias, odio distinctio quis reprehenderit similique? Ea saepe perferendis omnis?
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat ipsum numquam explicabo alias illo aliquid et vel non, quidem id ea enim, incidunt quo? Quae numquam harum rem tempora laudantium.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quam, ex eum voluptas delectus, fugit nihil earum repellendus, expedita maiores dolores facere iste perferendis alias temporibus! Voluptates illum voluptatem voluptate?
                </p>
            </Content>
        </ContentStyled>
    );
};

export default ContentComponent;