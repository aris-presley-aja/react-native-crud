import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

class EditEmployeeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            photo: "",
            age: "",
            loading: false,
            errorMessage: ''
        };
    }
// 
myfun = () => {
    //alert('clicked');

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          pic: response.data,
        });
      }
    });
  };
  uploadPic = () => {
    // IP Adreess dan letak file up
    RNFetchBlob.fetch(
      'PUT',
      'https://simple-contact-crud.herokuapp.com/contact',
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        // name: image adalah nama properti dari api kita
        {name: 'image', filename: 'tempbody.jpg', data: this.state.pic},
      ],
    ).then((resp) => {
      console.log('Response Saya');
      console.log(resp.data);
      alert('your image uploaded successfully');
      this.setState({avatarSource: null});
    });
  };
// 
    componentDidMount() {
        // state value is updated by selected employee data
        const { employee_firstname, employee_lastname, employee_photo, employee_age } = this.props.selectedEmployee;
        this.setState({
            first: employee_firstname,
            last: employee_lastname,            
            photo: employee_photo,
            age: employee_age,
        })
    }

    handleChange = (value, state) => {
        this.setState({ [state]: value })
    }

    updateEmployee = () => {
        // destructure state
        const { first, last, age } = this.state;
        this.setState({ errorMessage: "", loading: true });

        if (first && last && photo && age ) {
            // selected employee is updated with employee id
            fetch(`https://simple-contact-crud.herokuapp.com/contact/${this.props.selectedEmployee.id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first: this.state.first,
                    last: this.state.last,  
                    photo: this.state.photo,                  
                    age: this.state.age
                })
            })
                .then(res => res.json())
                .then(res => {
                    this.props.closeModal();
                    this.props.updateEmployee({
                        employee_firstname: res.first,
                        employee_lastname: res.last,                        
                        employee_photo: res.photo,
                        employee_age: res.age,
                        id: this.props.selectedEmployee.id
                    });
                })
                .catch(() => {
                    this.setState({ errorMessage: "Network Error. Please try again.", loading: false })
                })
        } else {
            this.setState({ errorMessage: "Fields are empty.", loading: false })
        }
    }

    render() {
        const { isOpen, closeModal } = this.props;
        const { first, last, photo, age, loading, errorMessage } = this.state;
        return (
            <Modal
                visible={isOpen}
                onRequestClose={closeModal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Update Employee</Text>

                    <TextInput
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "first")}
                        placeholder="First Name" />
                                            <TextInput
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "last")}
                        placeholder="Last Name" />
                    <TextInput
                        keyboardType="numeric"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "age")}
                        placeholder="Age" />
{/*  */}
<View style={styles.container}>
        <Text style={styles.welcome}>Upload Gambar</Text>

        <Image
          source={this.state.avatarSource}
          style={{width: '100%', height: 300, margin: 10}}
        />

        <TouchableOpacity
          style={{backgroundColor: 'orange', margin: 10, padding: 10}}
          onPress={this.myfun}>
          <Text style={{color: '#fff'}}>Pilih Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.uploadPic}>
          <Text>Upload</Text>
        </TouchableOpacity>
      </View>
    {/*  */}                        

                    {loading ? <Text
                        style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
                            style={styles.message}>{errorMessage}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.updateEmployee}
                            style={{ ...styles.button, marginVertical: 0 }}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        );
    }
}



export default EditEmployeeModal;

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    textBox: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(0,0,0,0.3)",
        marginBottom: 15,
        fontSize: 18,
        padding: 10
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        borderRadius: 5,
        marginVertical: 20,
        alignSelf: 'flex-start',
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16
    },
    message: {
        color: "tomato",
        fontSize: 17
    }
})