import './product.css'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Chart from '../../components/chart/Chart'
import { Publish } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'
import { userRequest } from '../../requestMethods'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import app from '../../firebase'
import { updateProduct } from '../../redux/apiCalls'

const Product = () => {
    const location = useLocation()
    const productId = location.pathname.split('/')[2]
    const product = useSelector(state => state.product.products.find(product => product._id === productId))
    const [pStats, setPStats] = useState([])
    const [inputs, setInputs] = useState({})
    const [file, setFile] = useState(null)
    const dispatch = useDispatch()

    const MONTHS = useMemo(() => [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ], [])

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await userRequest.get('order/income?iId=' + productId)
                const list = res.data.data.sort((a, b) => {
                    return a._id - b._id
                })
                list.map((item) =>
                    setPStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], Sales: item.total }
                    ])
                )
            } catch { }
        }
        getStats()
    }, [productId, MONTHS])

    const handleChange = (e) => {
        setInputs(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleClick = (e) => {
        e.preventDefault()

        if (file) {
            const fileName = new Date().getTime() + file.name
            const storage = getStorage(app)
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const item = { ...inputs, image: downloadURL }
                        updateProduct(productId, item, dispatch)
                    });
                }
            );
        } else {
            const item = { ...inputs }
            updateProduct(productId, item, dispatch)
        }
    }

    return (
        <div className='product'>
            <div className='productTitleContainer'>
                
            </div>
            <div className='productTop'>
                <div className='productTopLeft'>
                    <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
                </div>
                <div className='productTopRight'>
                    <div className='productInfoTop'>
                        <img src={product.image} alt='' className='productInfoImg' />
                        <span className='productName'>{product.title}</span>
                    </div>
                    <div className='productInfoBottom'>
                        <div className='productInfoItem'>
                            <span className='productInfoKey'>id: </span>
                            <span className='productInfoValue'>{product._id}</span>
                        </div>
                        <div className='productInfoItem'>
                            <span className='productInfoKey'>sales:</span>
                            <span className='productInfoValue'>4523</span>
                        </div>
                        <div className='productInfoItem'>
                            <span className='productInfoKey'>in stock:</span>
                            <span className='productInfoValue'>{product.inStock}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='productBottom'>
                <form className='productForm'>
                    <div className='productFormLeft'>
                        <label>Product Name</label>
                        <input name="title" type='text' placeholder={product.title} onChange={handleChange} />
                        <label>Product Description</label>
                        <input name="description" type='text' placeholder={product.description} onChange={handleChange} />
                        <label>Product Price</label>
                        <input name="price" type='number' placeholder={product.price} onChange={handleChange} />
                        <label>In Stock</label>
                        <select name='inStock' id='inStock' onChange={handleChange}>
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </select>
                    </div>
                    <div className='productFormRight'>
                            <label></label>
                            <input type='file' id='file' onChange={(e) => setFile(e.target.files[0])} />
                        <button onClick={handleClick} className='productButton'>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Product