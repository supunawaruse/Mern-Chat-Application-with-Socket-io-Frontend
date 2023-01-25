import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import './ImageCropper.css'
import { Form, Button, Spinner } from 'react-bootstrap'
import { getCroppedImg } from './canvasUtils'
import { useGlobal } from '../../contexts/GlobalContext';
import ax from 'axios'
import { updateUserProfileImg } from '../../services/UserServices'
import { useAuth } from '../../contexts/AuthContext'
import  {sha1} from 'crypto-hash'

const ImageCropper = ({ imageUrl, croppedImage, setCroppedImage, setShow }) => {

    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const imageSrc = useState(imageUrl)[0]
    const [loading, setLoading] = useState(false)
    const { userData, setUserData } = useAuth()

    const onCropComplete = useCallback((croppedArea, croppedAreaPixelsOnComplete) => {
        setCroppedAreaPixels(croppedAreaPixelsOnComplete);
    }, [])


    const showCroppedImage = useCallback(async () => {
        try {
            setLoading(true)
            const croppedImageNew = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            if (userData.profileImg.public_id !== "") {
                const timestamp = new Date().getTime()
                const string = `public_id=${userData.profileImg.public_id}&timestamp=${timestamp}uRrsa1ilLvCNaSwGd-y5T8TMiA4`
                const signature = await sha1(string)
                const formData = new FormData()
                formData.append("public_id",userData.profileImg.public_id)
                formData.append("signature",signature)
                formData.append("api_key","244594635669123")
                formData.append("timestamp",timestamp)
                const res = await ax.post("https://api.cloudinary.com/v1_1/dle7urchd/image/destroy", formData)
            }
            const formData = new FormData()
            formData.append("file", croppedImageNew)
            formData.append("upload_preset", "nvfbw6wr")
            const res = await ax.post("https://api.cloudinary.com/v1_1/dle7urchd/image/upload", formData)
            const profileImg = { url: res.data.url, public_id: res.data.public_id }
            await updateUserProfileImg(userData._id, profileImg)
            setUserData({ ...userData, profileImg })
            setCroppedImage(croppedImageNew)
            setShow(false);
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [imageSrc, croppedAreaPixels, rotation])

    return (

        <div>
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1 / 1}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{ containerStyle: { backgroundColor: '#262626', height: 300 }, }}
            />
            <div className='image-picker px-4'>
                <div className='row'>
                    <div className='mb-4 col-md-6'>
                        <Form>
                            <Form.Group controlId='formBasicRange'>
                                <Form.Label className='white-text'>Zoom</Form.Label>
                                <Form.Control type='range' value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </div>

                    <div className='col-md-6' >
                        <Form >
                            <Form.Group controlId='formBasicRange'>
                                <Form.Label className='white-text'>Rotate</Form.Label>
                                <Form.Control type='range' value={rotation} min={0} max={360} step={1} onChange={(e) => setRotation(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div className='text-center'>
                    <Button type='submit' variant="primary primary-button" className='main-form-submit' onClick={showCroppedImage}>
                        {
                            loading ? <Spinner animation="border" size="sm" variant="white" /> : 'Change Image'
                        }
                    </Button>
                </div>

            </div>
        </div>

    )
}

export default ImageCropper