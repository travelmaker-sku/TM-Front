import { useCallback, useRef } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deletePost } from "../../lib/api/write";
import { GetPostType } from "../../lib/type";
import { CyanButtonStyle, GrayButtonStyle } from "../../styles/ButtonStyle";
import palette from "../../styles/palette";
import Card from "./Card";
import CardDetail from "./CardDetail";
import { useNavigate } from "react-router";
import ReactToPrint from "react-to-print";

interface ModalType {
  post: GetPostType | null;
  open: boolean;
  close: () => void;
  my?: boolean;
  bookmark?: boolean;
}

const ModalBlock = styled.div`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background-color: rgba(0, 0, 0, 0.6);
  &.open {
    display: block;
  }
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .white-box {
    width: 65%;
    height: 70%;
    padding: 0 5%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    > li {
      width: 40%;
    }
    > li:first-of-type {
      > * {
        margin-bottom: 0;
        width: 100%;
      }
    }
    > li:last-of-type {
      margin-left: 10%;
    }
    > button {
      position: absolute;
      top: 30px;
      right: 30px;
      span {
        font-size: 32px;
        font-weight: 700;
      }
      span:hover {
        color: ${palette.gray[6]};
      }
    }
  }
  // Tablet
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    .white-box {
      width: 80%;
    }
  }
  // Mobile
  @media screen and (max-width: 767px) {
    .white-box {
      width: 80%;
      height: 90%;
      display: block;
      padding: 25px 7%;
      overflow: scroll;
      > li {
        width: 100%;
      }
      > li:last-of-type {
        margin-top: 40px;
        margin-left: 0;
      }
    }
  }
`;

const MyButton = styled.div`
  display: flex;
  position: absolute;
  bottom: -62px;
  right: 0;
  > * {
    margin-left: 15px;
    width: 150px;
  }
  .print-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // Mobile
  @media screen and (max-width: 767px) {
    width: 100%;
    position: static;
    > * {
      margin-left: 10px;
    }
    > *:first-child {
      margin-left: 0;
    }
  }
`;

const BookmarkButton = styled.div`
  position: absolute;
  bottom: -62px;
  right: 0;
  > * {
    width: 150px;
  }
  .print-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // Mobile
  @media screen and (max-width: 767px) {
    position: static;
    > * {
      width: 100%;
    }
  }
`;

const PostModal = ({ post, open, close, my, bookmark }: ModalType) => {
  const navigate = useNavigate();

  const refCard = useRef<HTMLLIElement>(null);

  // ?????? ??????
  const onEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      navigate("/editPhotocard", { state: post });
    },
    [navigate, post]
  );

  // ?????? ??????
  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      // @ts-ignore
      deletePost(post?.id)
        .then((res) => {
          if (res) {
            close();
            Swal.fire("???????????? ?????? ??????!", "", "success");
          }
        })
        .catch((err) => {
          console.warn(err);
        });
    },
    [close, post?.id]
  );

  return (
    <ModalBlock className={open ? "open" : ""}>
      <div className="container">
        <ul className="white-box">
          <li ref={refCard}>
            <Card post={post} />
          </li>
          <li>
            <CardDetail post={post} close={close} />
          </li>
          <button onClick={close} title="??????">
            <span className="material-icons">close</span>
          </button>
          {my ? (
            <MyButton>
              <ReactToPrint
                trigger={() => (
                  <CyanButtonStyle>
                    <button className="print-btn">
                      <span className="material-icons">print</span> &nbsp; ??????
                    </button>
                  </CyanButtonStyle>
                )}
                content={() => refCard.current}
              />
              <CyanButtonStyle>
                <button onClick={onEdit}>??????</button>
              </CyanButtonStyle>
              <GrayButtonStyle>
                <button onClick={onDelete}>??????</button>
              </GrayButtonStyle>
            </MyButton>
          ) : (
            ""
          )}
          {bookmark ? (
            <BookmarkButton>
              <ReactToPrint
                trigger={() => (
                  <CyanButtonStyle>
                    <button className="print-btn">
                      <span className="material-icons">print</span> &nbsp; ??????
                    </button>
                  </CyanButtonStyle>
                )}
                content={() => refCard.current}
              />
            </BookmarkButton>
          ) : (
            ""
          )}
        </ul>
      </div>
    </ModalBlock>
  );
};

export default PostModal;
