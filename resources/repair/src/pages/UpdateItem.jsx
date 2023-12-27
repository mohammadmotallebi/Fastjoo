import React, {useEffect, useRef} from 'react';
import {Block, Button, Card, CardContent, CardFooter, f7, Icon, List, ListInput, ListItem, Navbar, NavRight, Page, Preloader} from "framework7-react";
import {useQuery,} from 'react-query'
import {fetchBrands, fetchTypes, getItemById, updateItemById} from "../api/API";
import Dom7 from "dom7";
import Compressor from 'compressorjs';
import config from "../config.json";

const $$ = Dom7;
export const UpdateItem = ({id}) => {
    const notificationWithButton = useRef(null);
    const [images, setImages] = React.useState([]);
    const [itemData, setItemData] = React.useState({
        name: '',
        type_id: '',
        brand_id: '',
        model: '',
        serial: '',
        description: ''
    })
    const showNotificationWithButton = ({
                                            title = '',
                                            subtitle = '',
                                            text = '',
                                            closeTimeout = 3000,
                                            icon = '',
                                            closeButton = true,
                                        }) => {
        // Create toast
        if (!notificationWithButton.current) {
            notificationWithButton.current = f7.notification.create({
                icon,
                title,
                subtitle,
                text,
                closeButton,
                closeTimeout,
            });
        }
        // Open it
        notificationWithButton.current.open();
    };
    const {data, error, status, refetch, isLoading} = useQuery('data', () => {
        return Promise.all([fetchTypes(), fetchBrands(), getItemById(id)])
    }, {
        refetchOnWindowFocus: true,
        staleTime: 0,
        cacheTime: 0,
        refetchInterval: 0,
    })
    const handleImageUpload = (e) => {
        e.preventDefault();
        let files = e.target.files;

        console.log(e)
        for (let i = 0; i < files.length; i++) {
            new Compressor(files[i], {
                quality: 0.6,
                success(result) {
                    const reader = new FileReader();
                    reader.readAsDataURL(result);
                    reader.onloadend = function () {
                        const base64data = reader.result;
                        setImages(prevState => [...prevState, base64data])
                    }
                },
                error(err) {
                    console.log(err.message);
                },
            });
        }
        console.log(images)
    };
    useEffect(() => {
        refetch().then((res) => {
            setImages([])
            setItemData({
                name: '',
                type_id: '',
                brand_id: '',
                model: '',
                serial: '',
                description: ''
            })
            console.log('res: ', res)
            setItemData({
                name: res.data[2].item.name,
                type_id: res.data[2].item.type_id,
                brand_id: res.data[2].item.brand_id,
                model: res.data[2].item.model,
                serial: res.data[2].item.serial,
                description: res.data[2].item.description
            })
            res.data[2].item.images.map((image) => {
                setImages(prevState => [...prevState, image.image])
            })
        })

    }, [isLoading, data, refetch])

    const handlePreview = (img) => {
        console.log(img)
        const popupHTML = ` <div class="popup">
    <div class="view">
        <div class="page">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="left">
                        <a href="#" class="link popup-close">
                            <i class="icon icon-back"></i>
                            <span class="ios-only">Back</span>
                        </a>
                    </div>
                    <div class="title">Preview</div>
                </div>
            </div>
            <div class="page-content">
                <div class="block">
        <img src="${img}" alt="image" width="100%"/>
                    </div>
            </div>
        </div>
    </div>
</div>`
        f7.popup.create({
            content: popupHTML,
            on: {
                open() {
                    $$('.popup .page').addClass('with-navbar').removeClass('with-inset');
                },
                opened() {
                    $$('.popup .page').removeClass('with-navbar').addClass('with-inset');
                },
            }
        }).open();
    }


    const handleUpdateItem = () => {
        updateItemById(id,
            {
                name: $$('#name').val(),
                type_id: $$('#type').val(),
                brand_id: $$('#brand').val(),
                model: $$('#model').val(),
                serial: $$('#serial').val(),
                description: $$('#description').val(),
                images: images
            }
        ).then((res) => {
            if (res.success) {
                showNotificationWithButton({
                    title: 'Success',
                    text: 'Item Updated Successfully',
                    closeTimeout: 2000,
                    icon: '<i class="icon f7-icons color-green">checkmark_alt_circle_fill</i>',
                })
                f7.views.main.router.navigate('/')
            }
        }).catch((err) => {
            showNotificationWithButton({
                title: 'Error',
                text: data.message,
                closeTimeout: 3000,
                icon: '<i class="icon f7-icons color-red">exclamationmark_triangle_fill</i>',
            })
        })
    }
    if (status === 'loading') return (
        <Page>
            <Navbar title="add item" backLink="Back"/>
            <Block strong className={'text-align-center'}>
                <Preloader color="multi" size={50}/>
            </Block>
        </Page>
    )
    else if (status === 'error') return (
        <Page>
            <Navbar title="add item" backLink="Back"/>
            <Block strong inset className={'text-align-center'} bgColor={'red'}>
                <Icon f7="exclamationmark_triangle_fill" size={50} color={'white'}/>
                <p style={{
                    font: 'normal normal bold 20px/24px var(--f7-font-family-josefin)',
                }}>{error.message}</p>
            </Block>
        </Page>
    )
    else if (status === 'success') {
        return (
            <Page>
                <Navbar title="add item" backLink="Back">
                    <NavRight>
                        {/*Save Button*/}
                        <Button raised fill color="green" onClick={handleUpdateItem}><Icon f7="floppy_disk" size={14} style={{marginRight: '5px'}}/>Save</Button>
                    </NavRight>

                </Navbar>

                <List strongIos dividersIos insetIos>
                    <ListInput label="Item Name" type="text" placeholder="Enter Item Name" inputId="name" defaultValue={itemData.name} clearButton/>
                    {/*Type*/}
                    <ListItem title="Type"
                              smartSelect
                              smartSelectParams={{
                                  openIn: 'popup',
                                  searchbar: true,
                                  searchbarPlaceholder: 'Search item',
                                  popupCloseLinkText: 'Close',
                                  closeOnSelect: true,
                                  scrollToSelectedItem: true,
                                  popupPush: true,
                                  appendSearchbarNotFound: `  <div class="list list-strong-ios list-dividers-ios inset-ios">

      <ul>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Name</div>
            <div class="item-input-wrap">
              <input type="text" placeholder="Your name">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        </ul>
        </div>`
                              }}


                    >
                        <select name="types" defaultValue={itemData.type_id} id="type">
                            {status === 'success' && data[0].map((type, index) => (
                                <option key={index} value={type.id}>{type.type_name}</option>
                            ))}
                        </select>
                    </ListItem>
                    <ListItem title="Brand"
                              smartSelect
                              smartSelectParams={{
                                  openIn: 'popup',
                                  searchbar: true,
                                  searchbarPlaceholder: 'Search item',
                                  popupCloseLinkText: 'Close',
                                  closeOnSelect: true,
                                  scrollToSelectedItem: true,
                                  popupPush: true,
                                  appendSearchbarNotFound: `  <div class="list list-strong-ios list-dividers-ios inset-ios">
      <ul>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Name</div>
            <div class="item-input-wrap">
              <input type="text" placeholder="Your name">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        </ul>
        </div>`
                              }}


                    >
                        <select name="brands" defaultValue={itemData.brand_id} id="brand">
                            {status === 'success' && data[1].map((brand, index) => (
                                <option key={index} value={brand.id}>{brand.brand_name}</option>
                            ))}
                        </select>
                    </ListItem>

                    <ListInput label="Model" type="text" placeholder="Item Model" inputId="model" defaultValue={itemData.model} clearButton/>


                    <ListInput label="Serial Number" type="text" placeholder="Item Serial Number" inputId="serial" defaultValue={itemData.serial} clearButton/>

                    <ListInput label="Discription" type="textarea" placeholder="Discribe Item Status" inputId="description" defaultValue={itemData.description} clearButton/>

                    {/*Image upload*/}
                    <ListItem className="text-align-center">
                        <input type="file" style={{display: 'none'}} multiple accept="image/*" onChange={handleImageUpload}/>
                        <Button raised fill onClick={() => $$('input[type=file]').click()}><Icon f7="camera_fill" size={14} style={{marginRight: '5px'}}/>Upload Images</Button>
                    </ListItem>
                    <ListItem style={{overflowX: 'auto'}}>
                        {images.map((image, index) => (
                            <Card key={index} className="col-50" outline footerDivider>
                                <CardContent>
                                    <img key={index * 154} src={image} alt="image" height="120px" width="120px" style={{objectFit: 'cover'}} onClick={() => handlePreview(image)}/>
                                </CardContent>
                                <CardFooter>
                                    <Button className="col" style={{
                                        borderRadius: '6px 0 0 6px',
                                        width: '100%'
                                    }} raised fill onClick={() => {
                                        handlePreview(image)
                                    }}><Icon f7="eye_fill" size={14}/></Button>
                                    <Button className="col" style={{
                                        borderRadius: '0 6px 6px 0',
                                        width: '100%'
                                    }} raised fill onClick={(e) => {
                                        e.preventDefault();
                                        setImages(images.filter((image, i) => i !== index))
                                    }}><Icon f7="trash_fill" size={14}/></Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </ListItem>
                </List>
            </Page>
        )
    }
}



