from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np

texts = ["I am sad", "I feel happy", "I am stressed", "I feel great"]
labels = [0,1,0,1]

tokenizer = Tokenizer(num_words=1000)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded = pad_sequences(sequences, maxlen=5)

model = Sequential()
model.add(Embedding(1000,16,input_length=5))
model.add(LSTM(16))
model.add(Dense(1,activation='sigmoid'))

model.compile(loss='binary_crossentropy',optimizer='adam')
model.fit(padded,np.array(labels),epochs=5)

def predict_sentiment(text):
    seq = tokenizer.texts_to_sequences([text])
    pad = pad_sequences(seq,maxlen=5)
    pred = model.predict(pad)
    return "Positive" if pred[0][0] > 0.5 else "Negative"
