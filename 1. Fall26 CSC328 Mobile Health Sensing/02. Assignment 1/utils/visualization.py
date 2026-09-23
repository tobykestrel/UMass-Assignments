import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def plot_with_peaks(df, mag_col="mag", peaks=None):
    """Plot magnitude with optional peak markers."""
    plt.figure(figsize=(10, 4))
    plt.plot(df[mag_col].values, label=mag_col)
    if peaks is not None:
        plt.plot(peaks, df[mag_col].iloc[peaks], "rx", label="peaks")
    plt.legend()
    plt.show()

def zoom_plot(df, mag_col="mag", start=0, end=500):
    """Plot a zoomed-in view of the magnitude signal between start and end indices."""
    plt.figure(figsize=(10, 4))
    plt.plot(df[mag_col].iloc[start:end].values, label=f"{mag_col} (zoomed)")
    plt.title(f"Zoomed view of {mag_col} from {start} to {end}")
    plt.xlabel("Sample index")
    plt.ylabel("Magnitude")
    plt.legend()
    plt.tight_layout()
    plt.show()

