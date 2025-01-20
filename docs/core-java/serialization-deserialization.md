# Serialization and Deserialization


Serialization is a mechanism of converting the state of an object into a byte stream. Deserialization is the reverse process where the byte stream is used to recreate the actual Java object in memory. 
To make a Java object serializable we implement the `java.io.Serializable` interface.

Serialization in java is implemented by `ObjectInputStream` and `ObjectOutputStream`, so all we need is a wrapper over them to either save it to file or send it over the network.
The `ObjectOutputStream` class contains `writeObject()` method for serializing an Object.

```java
public final void writeObject(Object obj) throws IOException
```

The ObjectInputStream class contains readObject() method for deserializing an object.


```java
public final Object readObject() throws IOException, ClassNotFoundException
```

**Serialization**
```java
FileOutputStream fos = new FileOutputStream(fileName);
ObjectOutputStream oos = new ObjectOutputStream(fos);
oos.writeObject(obj);
fos.close();
```

**Deserialization**
```java
FileInputStream fis = new FileInputStream(fileName);
ObjectInputStream ois = new ObjectInputStream(fis);
Object obj = ois.readObject();
ois.close()
```

## Java Serialization Methods
We have seen that java serialization is automatic and all we need is implementing Serializable interface. The implementation is present in the ObjectInputStream and ObjectOutputStream classes. But what if we want to change the way we are saving data, for example we have some sensitive information in the object and before saving/retrieving we want to encrypt/decrypt it. That’s why there are four methods that we can provide in the class to change the serialization behavior.
If these methods are present in the class, they are used for serialization purposes.
1. readObject(ObjectInputStream ois): If this method is present in the class, ObjectInputStream readObject() method will use this method for reading the object from stream.
1. writeObject(ObjectOutputStream oos): If this method is present in the class, ObjectOutputStream writeObject() method will use this method for writing the object to stream. One of the common usage is to obscure the object variables to maintain data integrity.
1. Object writeReplace() : If this method is present, then after serialization process this method is called and the object returned is serialized to the stream.
    ```java
    * Serializable classes that need to designate an alternative object to be
    * used when writing an object to the stream should implement this
    * special method with the exact signature: <p>
    *
    * ANY-ACCESS-MODIFIER Object writeReplace() throws ObjectStreamException;
    ```
1. Object readResolve(): If this method is present, then after deserialization process, this method is called to return the final object to the caller program. One of the usage of this method is to implement Singleton pattern with Serialized classes. Read more at Serialization and Singleton.
    ```java
    * Classes that need to designate a replacement when an instance of it
    * is read from the stream should implement this special method with the
    * exact signature.<p>
    *
    * <PRE>
    * ANY-ACCESS-MODIFIER Object readResolve() throws ObjectStreamException;
    * </PRE><p>
    ```

```java
private Object writeReplace(){
    return new Student(2, "Sachin", "987654300", true);
}
 
private Object readResolve(){
    return new Student(17, "Sachin", "987650000", true);
}
```
Usually while implementing above methods, it’s kept as private so that subclasses can’t override them. They are meant for serialization purpose only and keeping them private avoids any security issue.

### References:
- [https://www.journaldev.com/2452/serialization-in-java](https://www.journaldev.com/2452/serialization-in-java)