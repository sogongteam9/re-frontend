import PropTypes from 'prop-types'; // PropTypes 추가
import * as D from './DetailModalStyle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Login/AuthContext';



const DetailModal = ({ isModalOpen, closeModal, menu}) => {
    const { isLoggedIn, userId } = useAuth(); // AuthContext에서 필요한 정보를 가져옴

    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const handleMenuClick = async() => {
        closeModal();
        try {
            const response = await fetch(`http://localhost:3000/app/getfood/${menu.id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log('Fetched Menu Details:', data);
        
            navigate(`/detail/${menu.id}`);
            } catch (error) {
                console.error('Error fetching menu details:', error);
            }
    }

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
        
    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };
    const authToken = localStorage.getItem('authToken');


    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            // 로그인 되지 않은 경우 처리
            // 예시로 토스트 메시지를 띄워 사용자에게 알림
            toast.error("로그인 후 이용해주세요.", {
                autoClose: 3000,
                position: toast.POSITION.TOP_CENTER,
            });
            // 로그인 페이지로 이동 또는 다른 로그인 처리를 수행할 수 있습니다.
            // navigate('/login'); // 예시로 로그인 페이지로 이동하는 코드
        } else {
            try {
                console.log('userId: ',userId);
                // 로그인된 경우 장바구니에 메뉴를 추가하는 로직을 구현하세요.
                const response = await fetch(`http://localhost:3000/app/addcart/${menu.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': authToken,
                    },
                    body: JSON.stringify({
                        foodid: menu.id,
                        count: quantity,
                    }),
                });
                console.log(response);
                if (!response.ok) {
                    const errorMessage = await response.text(); // 서버에서 전달한 에러 메시지 확인
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
                }

                // 성공적으로 장바구니에 추가된 경우
                toast.success(`${menu.title} ${quantity}개를 장바구니에 추가했습니다. 장바구니를 확인하세요!`, {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_CENTER,
                });
                console.log(`Added ${quantity} ${menu.title}(s) to the cart`);

                closeModal();
            } catch (error) {
                // 예외 처리: 네트워크 오류 등의 문제
                console.error('Error adding to cart:', error);
                toast.error('장바구니 추가 중 오류가 발생했습니다. 다시 시도해주세요.', {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
    };
    return (
        <>
        {isModalOpen && (
            <D.ModalOverlay>
                <D.ModalContent>
                    <D.CloseButton onClick={closeModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </D.CloseButton>

                    {/* <D.MenuTitle>{menu.id}</D.MenuTitle> */}
                        <D.MenuImage src={menu.image} alt={menu.name} />
                        <D.MenuTitle>{menu.title}</D.MenuTitle>
                        <D.InfoMenu>
                            <D.MenuDescription>{menu.content}</D.MenuDescription>
                            <D.MenuPrice>{menu.price}원</D.MenuPrice>
                        </D.InfoMenu>

                        <D.MenuTotal>
                            <D.MenuCount>
                                <FontAwesomeIcon icon={faCircleMinus} onClick={handleDecrease} />
                                {quantity}
                                <FontAwesomeIcon icon={faCirclePlus} onClick={handleIncrease} />
                            </D.MenuCount>
                        </D.MenuTotal>

                        <D.CartButton onClick={handleAddToCart}>
                            장바구니 담기
                        </D.CartButton>
                        <D.showReviewText onClick={handleMenuClick}>
                            SHOW REVIEW
                        </D.showReviewText>
                </D.ModalContent>
            </D.ModalOverlay>
        )}
        </>
    );
};

// PropTypes 추가
DetailModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    menu: PropTypes.object,
};

export default DetailModal;