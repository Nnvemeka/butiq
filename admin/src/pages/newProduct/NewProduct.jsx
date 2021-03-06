import { useState, useEffect } from 'react'
import './newProduct.css'
import { Link } from 'react-router-dom'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import app from '../../firebase'
import { addProduct } from '../../redux/apiCalls'
import { useDispatch } from 'react-redux'
import { userRequest } from '../../requestMethods'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const NewProduct = () => {
    const [inputs, setInputs] = useState({})
    const [file, setFile] = useState(null)
    const [categories, setCategories] = useState([])
    const [manufacturers, setManufacturers] = useState([])
    const [status, setStatus] = useState(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        const getCategories = async () => {
            const res = await userRequest.get('category')
            setCategories(res.data.data)
        }
        getCategories()
    }, [])

    useEffect(() => {
        const getManufacturers = async () => {
            const res = await userRequest.get('manufacturer')
            setManufacturers(res.data.data)
        }
        getManufacturers()
    }, [])

    const handleChange = (e) => {
        setInputs(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleClick = (e) => {
        e.preventDefault()
        const fileName = new Date().getTime() + file.name
        const storage = getStorage(app)
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

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
                    const product = { ...inputs, image: downloadURL }
                    try {
                        addProduct(product, dispatch)
                        setStatus({ type: 'success' })
                    } catch (e) {
                        setStatus({ type: 'error' }, e)
                    }
                });
            }
        );
        setInputs({})
    }

    return (
        <div className='newProduct'>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {status?.type === 'success' && <Alert severity="success">Product Added Successfully!</Alert>}
                {status?.type === 'error' && <Alert severity="error">An Error Occured!</Alert>}
            </Stack>
            <div className='addProductTitleContainer'>
                <h1>New Product</h1>
                <Link to="/category">
                    <button className='addProductAddBtn'>Create Category</button>
                </Link>
            </div>
            <form className='addProductForm'>
                <div className='addProductFormList'>
                    <div className='addProductItem'>
                        <label>Image</label>
                        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <div className='addProductItem'>
                        <label>Title</label>
                        <input name="title" type="text" placeholder="Title" onChange={handleChange} />
                    </div>
                    <div className='addProductItem'>
                        <label>Description</label>
                        <input name="description" type="text" placeholder="Description" onChange={handleChange} />
                    </div>
                    <div className='addProductItem'>
                        <label>Price</label>
                        <input name="price" type="number" placeholder="100" onChange={handleChange} />
                    </div>
                    <div className='addProductItem'>
                        <label>Color</label>
                        <input name="color" type="text" placeholder="Color" onChange={handleChange} />
                    </div>
                </div>
                <div className='addProductFormList'>
                    <div className='addProductItem'>
                        <label>Size</label>
                        <select name='size' id='size' onChange={handleChange}>
                            <option value="">-- Select --</option>
                            <option value='S'>S</option>
                            <option value='M'>M</option>
                            <option value='L'>L</option>
                            <option value='XL'>XL</option>
                        </select>
                    </div>
                    <div className='addProductItem'>
                        <label>In Stock</label>
                        <select name='inStock' id='inStock' onChange={handleChange}>
                            <option value="">-- Select --</option>
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </select>
                    </div>
                    <div className='addProductItem'>
                        <label>Category</label>
                        <select name='category' id='category' onChange={handleChange}>
                            <option value="">-- Select --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='addProductItem'>
                        <label>Manufacturer</label>
                        <select name='manufacturer' id='manufacturer' onChange={handleChange}>
                            <option value="">-- Select --</option>
                            {manufacturers.map((manu) => (
                                <option key={manu._id} value={manu._id}>{manu.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleClick} className='addProductButton'>Create</button>
                </div>
            </form>
        </div>
    )
}

export default NewProduct