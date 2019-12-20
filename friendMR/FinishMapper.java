import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;


public class FinishMapper extends Mapper<LongWritable, Text,Text,Text>
{
	public void map(LongWritable key, Text value,Context context)  throws IOException,InterruptedException
	{
		String line = value.toString();
		String[] parts = line.split("\t");
		if (parts.length<=1) { //input file so we can check who our existing friends are 
            String[] sep = line.split(":");
            String[] interests = sep[1].split(",");
            if(interests.length > 1){
                for (int i = 0; i < interests.length; i++){
                    context.write(new Text(sep[0]), new Text("EXISTING;" + interests[i]));
                }
            } else {
                context.write(new Text(sep[0]), new Text("EXISTING;" + interests[0]));
            }
		} else{
            String[] inputranks = parts[1].split(";");
            context.write(new Text(parts[0]),new Text(inputranks[0]));	
        }
	}
}
